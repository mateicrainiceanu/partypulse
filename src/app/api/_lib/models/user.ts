import { db } from "../config/db";
import bcrypt from 'bcrypt';
import { saltRounds } from "../types";
import { RowDataPacket } from "mysql2";
import Events from "./event";
import UserNotification from "./notifications";

interface User {
    id?: number,
    fname: string,
    lname: string,
    uname: string,
    email: string,
    role?: number,
    password: string,
    hash: string,
    verified: number
}

class User {
    constructor(fname: string, lname: string, uname: string, email: string, password: string, verified: number) {
        this.lname = lname;
        this.fname = fname;
        this.uname = uname;
        this.email = email;
        this.password = password;
        this.verified = verified;
    }

    async save() {

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(this.password, salt);

        let sql = `
        INSERT INTO users (
             fname, lname, uname, email, hash, verified
        ) 
        VALUES (
            '${this.fname}',
            '${this.lname}',
            '${this.uname}',
            '${this.email}',
            '${hash}',
            ${this.verified}
        );`

        return db.execute(sql);
    }

    static findByMail(email: string) {
        let sql = `
        SELECT * FROM users WHERE email = '${email}';
        `;

        return db.execute(sql);
    }

    static findById(id: number) {
        let sql = `
        SELECT * FROM users WHERE id=${id};
        `
        return db.execute(sql);
    }

    static update(id: number, fieldName: string, newValue: string) {
        let sql = `
        UPDATE users SET ${fieldName} = '${newValue}' WHERE id = ${id}; `
        return db.execute(sql);
    }

    static findByUserName(uname: string) {
        let sql = `
        SELECT * FROM users WHERE uname = '${uname}';
        `
        return db.execute(sql)
    }

    static getPartners(uid: number, q: string, role?: number, seeSelf?: boolean) {
        let sql = `
        SELECT uname FROM users 
        WHERE (uname LIKE '%${q}%' OR email LIKE '%${q}%') 
        AND ${role ? "role = " + role : "role != 0"}  
        ${seeSelf ? "" : "AND id != " + uid};`

        return db.execute(sql);
    }

    static getFromUname(uname: string, userId?: number) {
        return db.execute(`SELECT uname, role FROM users 
        WHERE (uname LIKE '%${uname}%' OR email LIKE '%${uname}%') ${userId ? "AND id != " + userId : ""};`)
    }

    static async addLocation(uid: number, locid: number) {
        let sql1 = `SELECT * FROM users_locations WHERE userId = ${uid} AND locationId = ${locid};`
        let [res] = await db.execute(sql1) as Array<RowDataPacket>
        if (!res.length) {
            let sql = `INSERT INTO users_locations (userId, locationId) VALUES (${uid}, ${locid});`
            return db.execute(sql);
        }
    }

    static async getId(uname: string) {

        let sql = `SELECT id FROM users WHERE uname = '${uname}';`
        const [response] = (await db.execute(sql)) as Array<RowDataPacket>
        return response[0].id
    }

    static async getLocations(locid: number) {
        let sql = `SELECT * FROM users_locations WHERE locationId = ${locid};`
        let [res] = await db.execute(sql) as Array<RowDataPacket>;

        var userIdString: string = ""
        res.map((usercoresp: { userId: number }) => { userIdString += usercoresp.userId + ", " })

        let sql2 = `SELECT id, uname FROM users WHERE id IN (${userIdString.substring(0, userIdString.length - 2)})`
        return db.execute(sql2)
    }

    static async addEventRelation(userId: number, eventId: number, reltype: number) {
        let [check] = await db.execute(`SELECT * FROM users_events WHERE userId = ${userId} AND eventId = ${eventId} AND reltype = ${reltype};`) as Array<RowDataPacket>
        if (check.length === 0) {
            let sql = `INSERT INTO users_events (userId, eventId, reltype) VALUES (${userId}, ${eventId}, ${reltype});`
            return (db.execute(sql))
        }
    }

    static async getDjsForId(eventId: number) {

        let [djsrelations] = await db.execute(`SELECT * FROM users_events WHERE eventId = ${eventId} AND reltype=2;`) as Array<RowDataPacket>

        return await djsrelations.map(async (djrel: { userId: number }) => {
            const response = await db.execute(`SELECT uname FROM users WHERE id = ${djrel.userId}; `) as Array<RowDataPacket>[0]

            return response[0][0].uname
        })
    }

    static addCode(uid: number, code: string) {
        return db.execute(`INSERT INTO codes (usedFor, itemId, code) VALUES('user' , ${uid}, '${code}');`)
    }

    static async validateCode(uid: number, code: string) {

        let [codeRes] = await db.execute(`SELECT * FROM codes WHERE code = '${code}';`) as Array<RowDataPacket>;

        var evId = 0;

        if (codeRes[0].usedFor == "user") {
            let userId = codeRes[0].itemId;
            let [foundEv] = await db.execute(`SELECT * FROM users_events WHERE userId = ${userId} AND (reltype = 1 OR reltype = 2);`) as Array<RowDataPacket>
            if (foundEv.length) {
                let q = ""
                foundEv.map((ev: { eventId: number }) => {
                    q += ev.eventId + ", "
                })
                if (q != "") {
                    let [events] = await db.execute(`SELECT id FROM events WHERE id IN (${q.substring(0, q.length - 2)}) AND status = 1;`) as Array<RowDataPacket>
                    if (events.length) {
                        evId = events[0].id
                    }
                }
            }
        } else {
            let locid = codeRes[0].itemId;
            let [foundEv] = await db.execute(`SELECT id FROM events WHERE locationId = ${locid} AND status = 1;`) as Array<RowDataPacket>
            if (foundEv.length) {
                evId = foundEv[0].id
            }
        }

        if (evId != 0) {
            await User.removeThereConf(uid)
            await User.addEventRelation(uid, evId, 3) as Array<RowDataPacket>
            return Events.getFullForId(evId, uid)
        } else {
            return null;
        }

    }

    static removeThereConf(uid: number) {
        return db.execute(`DELETE FROM users_events WHERE userId = ${uid} AND reltype = 3; `)
    }

    static getCodes(uid: number) {
        return db.execute(`SELECT * FROM codes WHERE usedFor = 'user' AND itemId = ${uid};`)
    }

    static deleteCode(codeId: string) {
        return db.execute(`DELETE FROM codes WHERE id = '${codeId}';`)
    }

    static relation(uid: number, nduid: number, reltype: number, val: boolean) {
        if (val) {
            new UserNotification({ forUserId: nduid, fromUserId: uid, nottype: "like", text: " liked your profile!" }).save()
            return db.execute(`INSERT INTO users_users (userId, secUserId, reltype) VALUES (${uid}, ${nduid}, ${reltype});`)
        } else
            return db.execute(`DELETE FROM users_users WHERE userId = ${uid} AND secUserId = ${nduid};`)
    }

    static async getUserAndRel(userid: number, reluser: number) {
        let [user] = (await db.execute(`SELECT role, uname, fname, lname, donations, created FROM users WHERE id = ${userid};`) as RowDataPacket[][])[0]

        let [relations] = (await db.execute(`SELECT * FROM users_users WHERE userId = ${reluser} AND secUserId = ${userid};`) as any)

        user = { ...user, followsYou: false, youFollow: false }

        relations.map((relation: { userId: number, secUserId: number, reltype: number }) => {
            if (relation.reltype == 1 && relation.userId == reluser)
                user = { ...user, youFollow: true }
            else if (relation.reltype == 1 && relation.userId == userid)
                user = { ...user, followsYou: true }
        })

        return user;
    }

    static async getRelUsers(uid: number) {
        let str = ""

        const [likedUsers] = (await db.execute(`SELECT * FROM users_users WHERE userId = ${uid};`) as any)
        if (likedUsers.length > 0) {
            likedUsers.map((r: { secUserId: number }) => {
                str += r.secUserId + ", "
            })
            return db.execute(`SELECT role, uname, fname, lname, donations, created FROM users WHERE id in (${str.substring(0, str.length - 2)}); `)
        } else {
            return [[]]
        }
    }

    static getFriends(uid: number) {
        return db.execute(`SELECT * FROM users_users WHERE userId = ${uid} ORDER BY id desc;`)
    }
}

export default User;