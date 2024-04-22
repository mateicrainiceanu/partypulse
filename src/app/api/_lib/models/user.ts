import { db } from "../config/db";
import bcrypt from 'bcrypt';
import { saltRounds } from "../types";
import { RowDataPacket } from "mysql2";

interface User {
    id?: number,
    fname: string,
    lname: string,
    uname: string,
    email: string,
    role?: number,
    password: string,
    hash: string
}

class User {
    constructor(fname: string, lname: string, uname: string, email: string, password: string) {
        this.lname = lname;
        this.fname = fname;
        this.uname = uname;
        this.email = email;
        this.password = password;
    }

    async save() {

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(this.password, salt);

        let sql = `
        INSERT INTO users (
             fname, lname, uname, email, hash
        ) 
        VALUES (
            '${this.fname}',
            '${this.lname}',
            '${this.uname}',
            '${this.email}',
            '${hash}'
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
}

export default User;