import { db } from "../config/db";
import Email from "./Email";
import Events from "./event";
import Location from "./location";
import User from "./user";

interface INotification {
    id?: number;
    forUserId: number;
    fromUserId: number;
    nottype?: string;
    text?: string;
    itemType?: string;
    itemId?: number;
}

export default class UserNotification {
    id?: number;
    forUserId: number;
    fromUserId: number;
    nottype?: string;
    text?: string;
    itemType?: string;
    itemId?: number;
    location?: Location;
    event?: Events;

    constructor(b: INotification) {
        this.forUserId = b.forUserId;
        this.fromUserId = b.fromUserId;
        this.nottype = b.nottype;
        this.text = b.text;
        this.itemType = b.itemType;
        this.itemId = b.itemId;
    }

    async save() {
        let sql = `INSERT INTO users_notifications (forUserId, fromUserId 
            ${this.nottype ? ", nottype" : ""}
            ${this.text ? ", text" : ""}
            ${this.itemType ? ", itemType" : ""}
            ${this.itemId ? ", itemId" : ""}
        ) VALUES (
            '${this.forUserId}',
            '${this.fromUserId}'
            ${this.nottype ? ", '" + this.nottype + "'" : ""}
            ${this.text ? ", '" + this.text + "'" : ""}
            ${this.itemType ? ", '" + this.itemType + "'" : ""}
            ${this.itemId ? ", '" + this.itemId + "'" : ""}
        );`

        const user = (await User.findById(this.forUserId) as any)[0][0]
        const mail = new Email(user.email)
        mail.notification(this)
        return db.execute(sql)
    }

    static async getFullNotification(notid: number, uid: number){
        let sql = `
SELECT
    users_notifications.*,
    JSON_OBJECT(
        'uname', users.uname,
        'role', users.role
    ) AS fromUser,
    JSON_OBJECT(
        'name', COALESCE(events.name, ''),
        'privateev', COALESCE(events.privateev, ''),
        'dateStart', COALESCE(events.dateStart, ''),
        'status', COALESCE(events.status, ''),
        'duration', COALESCE(events.duration, ''),
        'locationId', COALESCE(events.locationId, ''),
        'msuggestions', COALESCE(events.msuggestions, ''),
        'genreVote', COALESCE(events.genreVote, ''),
        'location', COALESCE(locations.name, ''),
        'usersRelations', COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'userId', users_events.userId,
                'reltype', users_events.reltype
            )
        ), JSON_ARRAY())
    ) AS event,
    JSON_OBJECT(
        'name', COALESCE(locations.name, ''),
        'userInteractions', COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'userId', users_locations.userId,
                'reltype', users_locations.reltype
            )
        ), JSON_ARRAY())
    ) AS location
FROM users_notifications
LEFT JOIN events ON (users_notifications.itemId = events.id AND users_notifications.itemType = 'event')
LEFT JOIN users_events ON (users_events.eventId = events.id AND users_notifications.itemType = 'event')
LEFT JOIN locations ON ((users_notifications.itemId = locations.id AND users_notifications.itemType = 'location') OR events.locationId = locations.id)
LEFT JOIN users_locations ON (users_locations.locationId = locations.id AND users_notifications.itemType = 'location') 
JOIN users ON users_notifications.fromUserId = users.id
WHERE users_notifications.id = ?
GROUP BY
    users_notifications.id,
    users.uname,
    locations.name
ORDER BY users_notifications.id DESC;

    `
        let [notifications] = await db.safeexe(sql, [notid])

        const res = notifications.map((notif: any) => {
            let processedNotif = notif
            if (notif.itemType == 'event') {
                processedNotif = { ...processedNotif, event: Events.process(notif.event, uid), location: null }
            } else if (notif.itemType == 'location') {
                processedNotif = { ...processedNotif, location: Location.getPermissionFor(notif.location, uid), event: null }
            }
            return processedNotif
        })

        return res
    }

    static async getForUser(uid: number) {

        let sql = `
SELECT
    users_notifications.*,
    JSON_OBJECT(
        'uname', users.uname,
        'role', users.role
    ) AS fromUser,
    JSON_OBJECT(
        'name', COALESCE(events.name, ''),
        'privateev', COALESCE(events.privateev, ''),
        'dateStart', COALESCE(events.dateStart, ''),
        'status', COALESCE(events.status, ''),
        'duration', COALESCE(events.duration, ''),
        'locationId', COALESCE(events.locationId, ''),
        'msuggestions', COALESCE(events.msuggestions, ''),
        'genreVote', COALESCE(events.genreVote, ''),
        'location', COALESCE(locations.name, ''),
        'usersRelations', COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'userId', users_events.userId,
                'reltype', users_events.reltype
            )
        ), JSON_ARRAY())
    ) AS event,
    JSON_OBJECT(
        'name', COALESCE(locations.name, ''),
        'userInteractions', COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'userId', users_locations.userId,
                'reltype', users_locations.reltype
            )
        ), JSON_ARRAY())
    ) AS location
FROM users_notifications
LEFT JOIN events ON (users_notifications.itemId = events.id AND users_notifications.itemType = 'event')
LEFT JOIN users_events ON (users_events.eventId = events.id AND users_notifications.itemType = 'event')
LEFT JOIN locations ON ((users_notifications.itemId = locations.id AND users_notifications.itemType = 'location') OR events.locationId = locations.id)
LEFT JOIN users_locations ON (users_locations.locationId = locations.id AND users_notifications.itemType = 'location') 
JOIN users ON users_notifications.fromUserId = users.id
WHERE users_notifications.forUserId = ?
GROUP BY
    users_notifications.id,
    users.uname,
    locations.name
ORDER BY users_notifications.id DESC;

    `
        let [notifications] = await db.safeexe(sql, [uid])

        const res = notifications.map((notif: any) => {
            let processedNotif = notif
            if (notif.itemType == 'event') {
                processedNotif = { ...processedNotif, event: Events.process(notif.event, uid), location: null }
            } else if (notif.itemType == 'location') {
                processedNotif = { ...processedNotif, location: Location.getPermissionFor(notif.location, uid), event: null }
            }
            return processedNotif
        })

        return res
    }

    static updateStatus(notid: number, newstatus: number, markAllAsRead: boolean, userId?: number) {
        if (!markAllAsRead)
            return db.execute(`UPDATE users_notifications SET status = ${newstatus} WHERE id = ${notid};`)
        else
            return db.execute(`UPDATE users_notifications SET status = 1 WHERE forUserId = ${userId};`)
    }
}