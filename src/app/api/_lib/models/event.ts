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
        this.time = obj.time.substring(0, 5);
        this.duration = obj.duration;
        this.djs = obj.djs;
        this.customLoc = obj.customLoc;
        this.locId = obj.locId;
        this.locName = obj.locName;
        this.locAdress = obj.locAdress;
    }

    async save() {
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

    static getIdsForUser(id: number, onlyManaged?: boolean, there?: boolean) {
        let sql = `SELECT eventId FROM users_events WHERE userId = ${id}`
        sql += onlyManaged ? ` AND (reltype = 1 OR reltype = 2);` : ""
        sql += there ? ` AND reltype = 3 ORDER BY id DESC;` : ""
        sql += ";"

        return db.execute(sql) as Promise<Array<RowDataPacket>>
    }

    static async getEventsForRelsUserId(uid: number, mainUsrId: number) {
        const [rels] = await db.execute(`SELECT eventId, reltype FROM users_events WHERE userId = ${uid};`) as any;
        const eventsWithData = rels.map(async (rel: { eventId: number, reltype: number }) => {
            const event = await Events.getFullForId(rel.eventId, mainUsrId, true)
            return { reltype: rel.reltype, event }
        })

        const matches = (await Promise.all(eventsWithData)).filter((o: { event: Events | null }) => (o.event != null))

        if (matches.length)
            return matches
        else
            return null
    }

    static async getFullForLocation(locId: number, mainUsrId?: number) {
        const location = (await Location.getFullLocation(locId, mainUsrId))

        const [events] = await db.execute(`SELECT id FROM events WHERE locationId = ${locId} ORDER BY status ASC, dateStart ASC ; `) as any

        const data = events.map(async (e: { id: number }) => {
            return await Events.getFullForId(e.id, mainUsrId, true, location)
        })

        return { location, events: await Promise.all(data) }
    }

    // static async getEventIdsForUser(id: number, onlyManaged:boolean) {
    //     const [eventsIds] = await db.execute(`SELECT * FROM users_events WHERE userId = ${id};`) as Array<RowDataPacket>

    //     const [userLocations] = await db.execute(`SELECT locationId FROM users_locations WHERE userId = ${id};`) as Array<RowDataPacket>

    //     var locQuery = ""

    //     userLocations.map((rel: { locationId: number }) => {
    //         locQuery += rel.locationId + ", "
    //     })

    //     var query = ''

    //     eventsIds.map((ev: { eventId: number }) => {
    //         query += (ev.eventId + ", ")
    //     })

    //     if (query != "" || locQuery != "") {
    //         const [events1] = await db.execute(`SELECT * FROM id WHERE
    //         ${query != "" ? `id IN (${query.substring(0, query.length - 2)})` : ""} 
    //         ${query != "" && locQuery != "" ? "OR" : ""}
    //         ${locQuery != "" ? `locationId IN (${locQuery.substring(0, locQuery.length - 2)})` : ""} 
    //         ORDER BY dateStart ASC;`);
    //         return events1;
    //     } else { return [] }
    // }

    static getLocId(eventId: number) {
        return db.execute(`SELECT * FROM events_locations WHERE eventId = ${eventId};`) as Promise<Array<RowDataPacket>>
    }

    static getForId(eventId: number, isNotOver?: boolean) {
        return db.execute(`SELECT * FROM events WHERE id = ${eventId} ${(isNotOver ? "AND status < 2" : "")};`)
    }

    static getForLocations(locString: number) {
        return db.execute(`SELECT * FROM events WHERE locationId IN (${locString})`);
    }

    static async getFullForId(id: number | string, userId?: number, isNotOver?: boolean, givenLocation?: Location | undefined) {

        const [events] = await Events.getForId(Number(id), isNotOver) as Array<RowDataPacket>

        if (events.length > 0) {

            const event = events[0]

            let location: Location
            if (givenLocation == undefined)
                location = (await Location.getFromIds(`${event.locationId}`) as any)[0][0]
            else
                location = givenLocation!

            const djs = await User.getDjsForId(event.id)

            const djsToReturn = await Promise.all(djs);

            var userHasRightToManage = 0
            var liked = false;
            var coming = false;
            var there = false;

            if (userId) {
                let [result] = (await Events.getUsersPermission(id as number, userId) as Array<RowDataPacket>)

                if (result.length > 0) {
                    userHasRightToManage = (result[0].reltype == 1 || result[0].reltype == 2 ? result[0].reltype : 0);
                    result.map(({ reltype }: { reltype: number }) => {
                        if (reltype == 3) {
                            there = true
                        }
                        if (reltype == 4) {
                            coming = true
                        }
                        if (reltype == 5) {
                            liked = true
                        }
                    })
                }
            }

            return { ...event, djs: djsToReturn, location: location.name, locationData: location, locationId: location.id, userHasRightToManage, there, coming, liked }
        } else {
            return null
        }
    }

    static deleteForId(id: number) {
        db.execute(`DELETE FROM user_events WHERE eventId = ${id};`)
        return db.execute(`DELETE FROM events WHERE id = ${id};`)
    }

    static endAssoc(eid: number, uid: number) {
        let sql = `DELETE FROM users_events WHERE userId = ${uid} AND eventId != ${eid} AND (reltype = 1 OR reltype = 2);`
        return db.execute(sql)
    }

    static async areOtherOngoingEvents(uid: number, force: boolean) {
        const [eventsRels] = await db.execute(`SELECT * FROM users_events WHERE userId = ${uid} AND (reltype = 1 OR reltype = 2); `) as any

        let str = ""

        eventsRels.map((rel: { eventId: number }) => {
            str += rel.eventId + ", "
        })

        if (force) {
            let [res] = await db.execute(`UPDATE events SET status = 0 WHERE id IN (${str.substring(0, str.length - 2)}) AND status = 1; `) as RowDataPacket[][]
            return []
        }

        if (str != "" && !force) {
            let [liveEvents] = await db.execute(`SELECT * FROM events WHERE id IN (${str.substring(0, str.length - 2)}) AND status = 1; `) as RowDataPacket[][]

            return liveEvents

        } else { return [] }



    }

    static changeStatus(id: number, newStatus: number) {
        return db.execute(`UPDATE events SET status = ${newStatus} WHERE id = ${id}`)
    }

    static getUsersPermission(eventId: number, userId: number) {
        return (db.execute(`SELECT reltype FROM users_events WHERE eventId = ${eventId} AND userId = ${userId} AND reltype != 0 ORDER BY reltype ASC;`))
    }

    static updateField(id: number, field: string, value: string | number) {
        return db.execute(`UPDATE events SET ${field} = '${value}' WHERE id = ${id};`) as Promise<Array<RowDataPacket>>
    }

    static searchByName(q: string) {
        return db.execute(`SELECT id FROM events WHERE name LIKE '%${q}%' AND privateev = 0;`)
    }

    static reaction(uid: number, eid: number, type: number, value: boolean) {
        if (value) {
            return db.execute(`INSERT INTO users_events (userId, eventId, reltype) VALUES (${uid}, ${eid}, ${type});`) as Promise<Array<RowDataPacket>>
        } else {
            return db.execute(`DELETE FROM users_events WHERE userId = ${uid} AND eventId = ${eid} AND reltype = ${type};`) as Promise<Array<RowDataPacket>>
        }
    }

    static async getMusicSuggestions(evId: number) {
        const [suggestions] = await db.execute(`SELECT * FROM requests WHERE eventId = ${evId}`) as RowDataPacket[];

        const data = await suggestions.map(async (suggestion: { songId: number, userId: number, status: number }) => {
            let [song] = (await db.execute(`SELECT * FROM songs WHERE id = ${suggestion.songId};`) as RowDataPacket[][])[0]
            return { ...suggestion, song }
        })

        //MAYBE ADD SORT FOR EACH SONG TO NOT APPEAR TWICE

        return await Promise.all(data)
    }

}

export default Events;