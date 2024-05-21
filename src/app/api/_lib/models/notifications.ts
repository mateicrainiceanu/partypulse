import { db } from "../config/db";
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
        return db.execute(sql)
    }

    static async getForUser(uid: number) {

        const [notifications]: UserNotification[][] = await db.execute(`SELECT * FROM users_notifications WHERE forUserId = ${uid};`) as any

        const fullNotifications = notifications.map(async notif => {
            const [{ uname, role }] = (await User.findById(notif.fromUserId) as any)[0]

            let fullNotif = { ...notif, from: {uname, role} }

            if (notif.itemType == "location" && notif.itemId)
                fullNotif = { ...fullNotif, location: await Location.getFullLocation(notif.itemId, uid) }
            else if (notif.itemType == "event" && notif.itemId)
                fullNotif = { ...fullNotif, event: await Events.getFullForId(notif.itemId, uid) }

            return fullNotif
        })

        return await Promise.all(fullNotifications)
    }
}