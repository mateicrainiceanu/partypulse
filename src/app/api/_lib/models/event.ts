import { RowDataPacket } from "mysql2";
import { db } from "../config/db";
import Location from "./location";
import User from "./user";

interface Events {
    id?: number;
    name: string;
    privateev: boolean;
    date: string;
    time: string;
    duration: string;
    djs: Array<string>,
    customLoc: boolean,
    locId: number,
    locName: string,
    locAdress: string
}

class Events {
    constructor(obj: Events) {
        this.name = obj.name;
        this.privateev = obj.privateev;
        this.date = obj.date;
        this.time = obj.time;
        this.duration = obj.duration;
        this.djs = obj.djs;
        this.customLoc = obj.customLoc;
        this.locId = obj.locId;
        this.locName = obj.locName;
        this.locAdress = obj.locAdress;
    }

    async save() {

        // const date = new Date(this.date + " " + this.time)
        const dur = this.duration
        const duration = Number(dur.split(":")[0]) + ((Number(dur.split(":")[1])) * (10 / 6) / 100)


        let sql = `
        INSERT INTO events (name, privateev, dateStart, duration) VALUES (
            '${this.name}',
            ${this.privateev ? 1 : 0},
            '${this.date + " " + this.time}:00',
            ${duration}
        );`
        return db.execute(sql);
    }

    async update(id: number) {
        const dur = this.duration
        const duration = Number(dur.split(":")[0]) + ((Number(dur.split(":")[1])) * (10 / 6) / 100)

        let sql = `UPDATE events SET
        name = '${this.name}',
        privateev = ${this.privateev ? 1 : 0},
        dateStart =  '${this.date + " " + this.time}:00',
        duration = ${duration}
        WHERE id = ${id};
        `
        return db.execute(sql);
    }

    static setLocation(eventId: number, locId: number) {
        let sql = `UPDATE events SET locationId = ${locId} WHERE id = ${eventId};`
        return db.execute(sql);
    }

    static async getForUser(id: number) {
        const [eventsIds] = await db.execute(`SELECT * FROM users_events WHERE userId = ${id};`) as Array<RowDataPacket>

        const [userLocations] = await db.execute(`SELECT locationId FROM users_locations WHERE userId = ${id};`) as Array<RowDataPacket>

        var locQuery = ""

        userLocations.map((rel: { locationId: number }) => {
            locQuery += rel.locationId + ", "
        })

        var query = ''

        eventsIds.map((ev: { eventId: number }) => {
            query += (ev.eventId + ", ")
        })

        if (query.length > 0 || locQuery.length > 0) {
            const [events1] = await db.execute(`SELECT * FROM events WHERE
            ${query.length > 0 ? `id IN (${query.substring(0, query.length - 2)})` : ""} 
            ${query.length > 0 && locQuery.length > 0 ? "OR" : ""}
            ${locQuery.length > 0 ? `locationId IN (${locQuery.substring(0, locQuery.length - 2)})` : ""} 
            ORDER BY dateStart ASC;`);
            return events1;
        } else { return [] }
    }

    static getLocId(eventId: number) {
        return db.execute(`SELECT * FROM events_locations WHERE eventId = ${eventId};`) as Promise<Array<RowDataPacket>>
    }

    static getForId(eventId: number) {
        return db.execute(`SELECT * FROM events WHERE id = ${eventId}`)
    }

    static getForLocations(locString: number) {
        return db.execute(`SELECT * FROM events WHERE locationId IN (${locString})`);
    }

    static async getFullForId(id: number | string) {
        const [events] = await Events.getForId(Number(id)) as Array<RowDataPacket>

        const event = events[0]

        const [location] = await Location.getFromIds(`${event.locationId}`) as Array<RowDataPacket>

        const djs = await User.getDjsForId(event.id)

        const djsToReturn = await Promise.all(djs);

        return { ...event, djs: djsToReturn, location: location[0].name, locationData: location[0], locationId: location[0].id }
    }

    static deleteForId(id: number) {
        db.execute(`DELETE FROM user_events WHERE eventId = ${id};`)
        return db.execute(`DELETE FROM events WHERE id = ${id};`)
    }

    static changeStatus(id: number, newStatus: number) {
        return db.execute(`UPDATE events SET status = ${newStatus} WHERE id = ${id}`)
    }

    static getUsersPermission(eventId: number, userId: number) {
        return (db.execute(`SELECT reltype FROM users_events WHERE eventId = ${eventId} AND userId = ${userId} ORDER BY reltype DESC;`))
    }
}

export default Events;