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
             fname, lname, uname, email, hash, donations, verified
        ) 
        VALUES (
            ?,?,?,?,?,'',?
        );`

        return db.safeexe(sql, [this.fname,
        this.lname,
        this.uname,
        this.email,
            hash,

        this.verified]);
    }

    static findByMail(email: string) {
        let sql = `
        SELECT * FROM users WHERE email = ?;
        `;

        return db.safeexe(sql, [email]);
    }

    static findById(id: number) {
        let sql = `
        SELECT * FROM users WHERE id=?;
        `
        return db.safeexe(sql, [id]);
    }

    static update(id: number, fieldName: string, newValue: string) {
        let sql = `
        UPDATE users SET ${fieldName} = ? WHERE id = ?; `
        return db.safeexe(sql, [newValue, id]);
    }

    static findByUserName(uname: string) {
        let sql = `
        SELECT * FROM users WHERE uname = ?;
        `
        return db.safeexe(sql, [uname])
    }

    static getPartners(uid: number, q: string, role?: number, seeSelf?: boolean) {
        let q1 = `%${q}%`;

        let sql = `
        SELECT uname FROM users 
        WHERE (uname LIKE ? OR email LIKE ?) 
        AND ${role ? "role = " + role : "role != 0"}  
        ${seeSelf ? "" : ("AND id != " + "?")};`

        return db.safeexe(sql, [q1, q1, (seeSelf ? null as any : uid)]);
    }

    static getFromUname(uname: string, userId?: number) {
        const q = `%${uname}%`
        return db.safeexe(`SELECT uname, role FROM users 
        WHERE (uname LIKE ? OR email LIKE ?) ${userId ? "AND id != " + userId : ""};`, [q, q])
    }

    static async addLocation(uid: number, locid: number) {
        let sql1 = `SELECT * FROM users_locations WHERE userId = ? AND locationId = ?;`
        let [res] = await db.safeexe(sql1, [uid, locid]) as Array<RowDataPacket>
        if (!res.length) {
            let sql = `INSERT INTO users_locations (userId, locationId) VALUES (?, ?);`
            return db.safeexe(sql, [uid, locid]);
        }
    }

    static async getId(uname: string) {

        let sql = `SELECT id FROM users WHERE uname = ?;`
        const [response] = (await db.safeexe(sql, [uname])) as Array<RowDataPacket>
        return response[0].id
    }

    static async getLocations(locid: number) {
        let sql = `SELECT * FROM users_locations WHERE locationId = ?;`
        let [res] = await db.safeexe(sql, [locid]) as Array<RowDataPacket>;

        var userIdString: string = ""
        res.map((usercoresp: { userId: number }) => { userIdString += usercoresp.userId + ", " })

        let sql2 = `SELECT id, uname FROM users WHERE id IN (${userIdString.substring(0, userIdString.length - 2)})`
        return db.execute(sql2)
    }

    static async addEventRelation(userId: number, eventId: number, reltype: number) {
        let [check] = await db.safeexe(`SELECT * FROM users_events WHERE userId = ? AND eventId = ? AND reltype = ?;`, [userId, eventId, reltype]) as Array<RowDataPacket>
        if (check.length === 0) {
            let sql = `INSERT INTO users_events (userId, eventId, reltype) VALUES (?,?,?);`
            return (db.safeexe(sql, [userId, eventId, reltype]))
        }
    }

    static async getDjsForId(eventId: number) {

        let [djsrelations] = await db.safeexe(`SELECT * FROM users_events WHERE eventId = ? AND reltype=2;`, [eventId]) as Array<RowDataPacket>

        return await djsrelations.map(async (djrel: { userId: number }) => {
            const response = await db.execute(`SELECT uname FROM users WHERE id = ${djrel.userId}; `) as Array<RowDataPacket>[0]
            if (response[0][0].uname)
                return response[0][0].uname
            else return null
        })
    }

    static addCode(uid: number, code: string, recovery?: boolean) {
        return db.safeexe(`INSERT INTO codes (usedFor, itemId, code) VALUES('${recovery ? "recovery" : "user"}' , ?, ?);`, [uid, code])
    }

    static getForRecoveryCode(code: string){
        return db.safeexe(`SELECT users.*, codes.code FROM codes JOIN users ON users.id = codes.itemId WHERE codes.usedFor = 'recovery' AND codes.code = ?; `, [code])
    }

    static async validateCode(uid: number, code: string) {

        let [codeRes] = await db.safeexe(`SELECT * FROM codes WHERE code = ?;`, [code]) as Array<RowDataPacket>;

        var evId = 0;

        if (codeRes[0].usedFor == "user") {
            let userId = codeRes[0].itemId;
            let [foundEv] = await db.safeexe(`SELECT * FROM users_events WHERE userId = ? AND (reltype = 1 OR reltype = 2);`, [userId]) as Array<RowDataPacket>
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
        return db.safeexe(`DELETE FROM users_events WHERE userId = ? AND reltype = 3; `, [uid])
    }

    static getCodes(uid: number) {
        return db.safeexe(`SELECT * FROM codes WHERE usedFor = 'user' AND itemId = ?;`, [uid])
    }

    static deleteCode(codeId: string) {
        return db.safeexe(`DELETE FROM codes WHERE id = ?;`, [codeId])
    }

    static relation(uid: number, nduid: number, reltype: number, val: boolean) {
        if (val) {
            new UserNotification({ forUserId: nduid, fromUserId: uid, nottype: "like", text: " liked your profile!" }).save()
            return db.safeexe(`INSERT INTO users_users (userId, secUserId, reltype) VALUES (?, ?, ?);`, [uid, nduid, reltype])
        } else
            return db.safeexe(`DELETE FROM users_users WHERE userId = ? AND secUserId = ?;`, [uid, nduid])
    }

    static async getUserAndRel(userid: number, reluser: number) {
        let [user] = (await db.safeexe(`SELECT role, uname, fname, lname, donations, created FROM users WHERE id = ?;`, [userid]) as RowDataPacket[][])[0]

        let [relations] = (await db.safeexe(`SELECT * FROM users_users WHERE userId = ? AND secUserId = ?;`, [reluser, userid]) as any)

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

        const [likedUsers] = (await db.safeexe(`SELECT * FROM users_users WHERE userId = ?;`, [uid]) as any)
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
        return db.safeexe(`SELECT * FROM users_users WHERE userId = ? ORDER BY id desc;`, [uid])
    }
}

export default User;