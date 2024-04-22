import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

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

    static setLocation(eventId: number, locId: number) {
        let sql = `INSERT INTO events_locations (eventId, locationId) VALUES (${eventId}, ${locId});`
        return db.execute(sql);
    }

    static async getForUser(id: number) {
        const [eventsIds] = await db.execute(`SELECT * FROM users_events WHERE userId = ${id};`) as Array<RowDataPacket>
        
        var query = ''
        
        eventsIds.map((ev: { eventId: number }) => {
            query += (ev.eventId + ", ")
        })
        
        const [events] = await db.execute(`SELECT * FROM events WHERE id IN (${query.substring(0, query.length - 2)}) ORDER BY id DESC;`);
        return events;
    }
    
    static getLocId(eventId: number){
        return db.execute(`SELECT * FROM events_locations WHERE eventId = ${eventId};`) as Promise<Array<RowDataPacket>>
    }
}

export default Events;