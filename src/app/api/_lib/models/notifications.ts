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

    static async getForUser(uid: number) {

        const [notifications]: UserNotification[][] = await db.execute(`SELECT * FROM users_notifications WHERE forUserId = ${uid} ORDER BY id DESC;`) as any

        const fullNotifications = notifications.map(async notif => {
            const [{ uname, role }] = (await User.findById(notif.fromUserId) as any)[0]

            let fullNotif = { ...notif, from: { uname, role } }

            if (notif.itemType == "location" && notif.itemId)
                fullNotif = { ...fullNotif, location: await Location.getFullLocation(notif.itemId, uid) }
            else if (notif.itemType == "event" && notif.itemId)
                fullNotif = { ...fullNotif, event: await Events.getFullForId(notif.itemId, uid) }

            return fullNotif
        })

        return await Promise.all(fullNotifications)
    }

    static async getFullNotification(notif: UserNotification, uid: number) {
        const [{ uname, role }] = (await User.findById(notif.fromUserId) as any)[0]

        let fullNotif = { ...notif, from: { uname, role } }

        if (notif.itemType == "location" && notif.itemId)
            fullNotif = { ...fullNotif, location: await Location.getFullLocation(notif.itemId, uid) }
        else if (notif.itemType == "event" && notif.itemId)
            fullNotif = { ...fullNotif, event: await Events.getFullForId(notif.itemId, uid) }

        return fullNotif
    }

    static updateStatus(notid: number, newstatus: number, markAllAsRead: boolean, userId?: number) {
        if (!markAllAsRead)
            return db.execute(`UPDATE users_notifications SET status = ${newstatus} WHERE id = ${notid};`)
        else
            return db.execute(`UPDATE users_notifications SET status = 1 WHERE forUserId = ${userId};`)
    }
}