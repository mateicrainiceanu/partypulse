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
    locAdress: string,
    userRelations?: Array<{ userId: number, reltype: number, uname: string }>

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
            ?,?,?, ?
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

    static async getForUser(id: number, onlyManaged?: boolean, there?: boolean) {

        let query = `events.id IN ( SELECT eventId FROM users_events WHERE userId = ? AND reltype ${there ? '= 3' : (onlyManaged ? "< 3" : '> 3')} )`
        const [events] = await db.safeexe(getEventQuery(query), [id])
        return events.filter((p: Events) => p != null).map((e: Events) => Events.process(e, id))

    }

    static async getEventsForRelsUserId(uid: number, mainUsrId: number) {
        //TO BE REVISITED

        const [events] = await db.safeexe(getEventQuery("users_events.userId = ? AND events.status = 0"), [uid]) as any
        const processed = events.map((e: Events) => {
            return Events.process(e, mainUsrId)
        })

        const matches = processed.map((e: Events) => {
            let rel = 0
            e.userRelations?.map((inter: { userId: number, reltype: number }) => {
                if (inter.userId = uid)
                    rel = inter.reltype
            });

            return { event: e, reltype: rel }
        })

        if (matches.length)
            return matches
        else
            return null
    }

    static async getFullForLocation(locId: number, mainUsrId?: number, isNotOver?: boolean) {
        const location = (await Location.getFullLocation(locId, mainUsrId)) as any

        const [events] = await db.safeexe(getEventQuery("events.locationId = ? " + (isNotOver ? "AND events.status < 2" : "")), [locId]) as any
        const processedEvents = events.filter((p: Events) => p != null).map((e: Events) => Events.process(e, mainUsrId))

        return { location, events: processedEvents }
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

    static async getFullForId(id: number | string, uid?: number, isNotOver?: boolean, givenLocation?: Location | undefined) {

        const [res] = await db.safeexe(getEventQuery("events.id = ?"), [id])

        const [event] = res
        if (res.length > 0)
            return Events.process(event, uid)
        else return null
    }

    static async getForIdRange(idrange: number | string, uid?: number, isNotOver?: boolean, givenLocation?: Location | undefined) {

        const [res] = await db.execute(getEventQuery(`events.id IN ${idrange}`))

        const [event] = res
        if (res.length > 0)
            return Events.process(event, uid)
        else return null
    }

    static process(event: Events, uid?: number) {
        let djs: string[] = []
        let userHasRightToManage = false
        let userIsDJ = false
        let there = false
        let coming = false
        let liked = false

        event.userRelations?.map((rel) => {
            if (rel.userId === uid) {
                switch (rel.reltype) {
                    case 1:
                        userHasRightToManage = true
                        break;
                    case 2:
                        userIsDJ = true
                        break;
                    case 3:
                        there = true
                        break;
                    case 4:
                        coming = true
                        break;
                    case 5:
                        liked = true
                        break;
                    default:
                        break;
                }
            }

            if (rel.reltype === 2 && djs.indexOf(rel.uname) == -1)
                djs.push(rel.uname)

        })

        return { ...event, djs, userHasRightToManage, userIsDJ, there, liked, coming }
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
        let sql = `
        SELECT songs.*,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'uname', users.uname
            )
        ) as requests,
        MIN(requests.status) AS status
        FROM requests
        JOIN songs ON songs.id = requests.songId
        JOIN users ON requests.userId = users.id
        WHERE requests.eventId=?
        GROUP BY songs.id;
    `

        let [res] = await db.safeexe(sql, [evId])
        return res
    }

}

function getEventQuery(query: string) {
    return `
    SELECT
            events.*,
            locations.name AS location,
            JSON_OBJECT(
                'id', locations.id,
                'name', locations.name,
                'adress', locations.adress,
                'useForAdress', locations.useForAdress,
                'lat', locations.lat,
                'lon', locations.lon,
                'city', locations.city,
                'userInteractions', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'userId', users_locations.userId,
                    'reltype', users_locations.reltype
                ))
            ) AS locationData,
            JSON_ARRAYAGG(
               JSON_OBJECT(
                    'userId', users_events.userId,
                    'reltype', users_events.reltype,
                    'uname', users.uname
                )
            ) AS userRelations
        FROM events
        JOIN locations ON locations.id = events.locationId
        JOIN users_events ON users_events.eventId = events.id
        JOIN users ON users.id = users_events.userId
        JOIN users_locations ON users_locations.locationId = locations.id
        WHERE ${query}
        GROUP BY events.id, locations.id;
        `
}

export default Events;