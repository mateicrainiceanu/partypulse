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

        var query = ''

        eventsIds.map((ev: { eventId: number }) => {
            query += (ev.eventId + ", ")
        })

        if (query.length > 0) {
            const [events] = await db.execute(`SELECT * FROM events WHERE id IN (${query.substring(0, query.length - 2)}) ORDER BY id DESC;`);
            return events;
        } else { return [] }
    }

    static getLocId(eventId: number) {
        return db.execute(`SELECT * FROM events_locations WHERE eventId = ${eventId};`) as Promise<Array<RowDataPacket>>
    }

    static getForId(eventId: number) {
        return db.execute(`SELECT * FROM events WHERE id = ${eventId}`)
    }

    static async getFullForId(id: number | string) {
        const [events] = await Events.getForId(Number(id)) as Array<RowDataPacket>

        const event = events[0]

        const [location] = await Location.getFromIds(`${event.locationId}`) as Array<RowDataPacket>

        const djs = await User.getDjsForId(event.id)

        const djsToReturn = await Promise.all(djs);

        return { ...event, djs: djsToReturn, location: location[0].name, locationId: location[0].id }
    }

    static deleteForId(id: number) {
        return db.execute(`DELETE FROM events WHERE id = ${id};`)
    }
}

export default Events;