import { RowDataPacket } from "mysql2";
import { db } from "../config/db";
import Location from "./location";
import User from "./user";
import UserNotification from "./notifications";
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
            ?,
            ?,
            ?,
           ?
        );`
        return db.safeexe(sql, [this.name, (this.privateev ? 1 : 0), (this.date + " " + this.time + ":00"), duration]);
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

    // async update(id: number) {
    //     const dur = this.duration
    //     const duration = Number(dur.split(":")[0]) + ((Number(dur.split(":")[1])) * (10 / 6) / 100)

    //     let sql = `UPDATE events SET 
    //     name=?,
    //     privateev=?,
    //     dateStart=?,
    //     duration=? 
    //     WHERE id=?;
    //     `
    //     return db.safeexe(sql, [this.name, (this.privateev ? 1 : 0), (this.date + "T" + this.time + ":00"), duration, id]);
    // }

    static setLocation(eventId: number, locId: number) {
        let sql = `UPDATE events SET locationId = ? WHERE id = ?;`
        return db.safeexe(sql, [locId, eventId]);
    }

    static getIdsForUser(id: number, onlyManaged?: boolean, there?: boolean) {
        let sql = `SELECT eventId FROM users_events WHERE userId = ?`
        sql += onlyManaged ? ` AND (reltype = 1 OR reltype = 2);` : ""
        sql += there ? ` AND reltype = 3 ORDER BY id DESC;` : ""
        sql += ";"

        return db.safeexe(sql, [id]) as Promise<Array<RowDataPacket>>
    }

    static async getEventsForRelsUserId(uid: number, mainUsrId: number) {
        const [rels] = await db.safeexe(`SELECT eventId, reltype FROM users_events WHERE userId = ?;`, [uid]) as any;
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

        const [events] = await db.safeexe(`SELECT id FROM events WHERE locationId = ? ORDER BY status ASC, dateStart ASC ; `, [locId]) as any

        const data = events.map(async (e: { id: number }) => {
            return await Events.getFullForId(e.id, mainUsrId, true, location)
        })

        return { location, events: await Promise.all(data) }
    }

    static getLocId(eventId: number) {
        return db.safeexe(`SELECT * FROM events_locations WHERE eventId = ?;`, [eventId]) as Promise<Array<RowDataPacket>>
    }

    static getForId(eventId: number, isNotOver?: boolean) {
        return db.safeexe(`SELECT * FROM events WHERE id = ? ${(isNotOver ? "AND status < 2" : "")};`, [eventId])
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

            const djs = (await User.getDjsForId(event.id))

            const djsToReturn = (await Promise.all(djs)).filter((s: string) => s != null);

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
        db.safeexe(`DELETE FROM users_notifications WHERE itemType = 'event' and itemId = ?;`, [id])
        db.safeexe(`DELETE FROM user_events WHERE eventId = ?;`, [id])
        return db.safeexe(`DELETE FROM events WHERE id = ?;`, [id])
    }

    static endAssoc(eid: number, uid: number) {
        let sql = `DELETE FROM users_events WHERE userId = ? AND eventId != ? AND (reltype = 1 OR reltype = 2);`
        return db.safeexe(sql, [uid, eid])
    }

    static async areOtherOngoingEvents(uid: number, force: boolean) {
        const [eventsRels] = await db.safeexe(`SELECT * FROM users_events WHERE userId = ? AND (reltype = 1 OR reltype = 2); `, [uid]) as any

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
        return (db.safeexe(`SELECT reltype FROM users_events WHERE eventId = ? AND userId = ? AND reltype != 0 ORDER BY reltype ASC;`, [eventId, userId]))
    }

    static updateField(id: number, field: string, value: string | number) {
        return db.safeexe(`UPDATE events SET ${field} = ? WHERE id = ?;`, [value, id]) as Promise<Array<RowDataPacket>>
    }

    static searchByName(q: string) {
        let query = `%${q}%`
        return db.safeexe(`SELECT id FROM events WHERE name LIKE ? AND privateev = 0;`, [query])
    }

    static async reaction(uid: number, eid: number, type: number, value: boolean) {
        if (value) {
            const [u]: { userId: number, reltype: number }[][] = await db.safeexe(`SELECT userId, reltype FROM users_events WHERE eventId = ?;`, [eid])
            u.map(u => {
                if ((type == 1 || type == 2) && (u.reltype == 1 || u.reltype == 2))
                    new UserNotification({ forUserId: u.userId, fromUserId: uid, nottype: "event-manager-add", text: "can now manage your event.", itemType: "event", itemId: eid }).save()
                else if ((type == 4 || type == 5) && (u.reltype == 1 || u.reltype == 2))
                    new UserNotification({ forUserId: u.userId, fromUserId: uid, nottype: "event-reaction", text: (type == 4 ? " is coming to" : " liked") + " your event.", itemType: "event", itemId: eid }).save()
            })
            return db.safeexe(`INSERT INTO users_events (userId, eventId, reltype) VALUES (?,?,?);`, [uid, eid, type]) as Promise<Array<RowDataPacket>>
        } else {
            return db.safeexe(`DELETE FROM users_events WHERE userId = ? AND eventId = ? AND reltype = ?;`, [uid, eid, type]) as Promise<Array<RowDataPacket>>
        }
    }

    static async getMusicSuggestions(evId: number) {
        const [suggestions] = await db.safeexe(`SELECT * FROM requests WHERE eventId = ?`, [evId]) as RowDataPacket[];

        const data = await suggestions.map(async (suggestion: { songId: number, userId: number, status: number }) => {
            let [song] = (await db.execute(`SELECT * FROM songs WHERE id = ${suggestion.songId};`) as RowDataPacket[][])[0]
            return { ...suggestion, song }
        })

        //MAYBE ADD SORT FOR EACH SONG TO NOT APPEAR TWICE

        return await Promise.all(data)
    }

}

export default Events;