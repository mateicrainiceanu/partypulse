import { RowDataPacket } from "mysql2";
import { db } from "../config/db"

interface Location {
    id?: number,
    name: string,
    useForAdress: string,
    adress: string,
    city: string,
    lat: number,
    lon: number,
}

class Location {
    constructor(name: string, useForAdress: string, adress: string, city: string, lat: number, lon: number) {
        this.name = name;
        this.useForAdress = useForAdress;
        this.adress = adress;
        this.city = city;
        this.lat = lat ? lat : 0;
        this.lon = lon ? lon : 0;
    }

    async save() {
        let sql = `
        INSERT INTO locations (name, useForAdress, adress, city, lat, lon) VALUES (
            ?,?,?,?,?,?
        );
        `

        return db.safeexe(sql, [this.name, this.useForAdress, this.adress, this.city, this.lat, this.lon]);
    }

    static async privateLoc(name: string, adress: string) {
        let sql = `INSERT INTO locations (name, adress, useForAdress, city, private) VALUES (?,?, 'adress', '', 1)`
        return (await db.safeexe(sql, [name, adress]) as Array<RowDataPacket>)[0].insertId
    }

    static getFromIds(idrange: string) {
        let sql = `
        SELECT * FROM locations WHERE id IN (${idrange});`
        return db.execute(sql);
    }

    async updateWhereId(id: number) {
        let sql = `
        UPDATE locations SET 
        name=?,
        useForAdress=?,
        adress=?,
        city=?,
        lat=?,
        lon=?
        WHERE id=?;
        `
        return db.safeexe(sql, [this.name, this.useForAdress, this.adress, this.city, this.lat, this.lon, id])
    }

    static deleteUserAccess(uid: string, locid: string) {
        let sql = `DELETE from users_locations WHERE locationId=? AND userId=?`
        return db.safeexe(sql, [locid, uid])
    }

    static getContaining(name: string) {
        const q = `%${name}%`
        let sql = `SELECT id, name FROM locations WHERE 
        name LIKE ? AND 
        private = 0;`
        return db.safeexe(sql, [q]);
    }

    static findFromString(q: string) {
        const q1 = `%${q}%`
        let sql = `SELECT * FROM locations WHERE name LIKE ?;`
        return db.safeexe(sql, [q1]) as Promise<Array<RowDataPacket>>
    }

    static async reaction(uid: number, locid: number, liked: boolean) {
        if (liked) {
            let sql1 = `SELECT * FROM users_locations WHERE userId = ? AND locationId = ? AND reltype = 0;`
            let [res] = await db.safeexe(sql1, [uid, locid]) as Array<RowDataPacket>
            if (!res.length) {
                let sql = `INSERT INTO users_locations (userId, locationId, reltype) VALUES (?, ?, 0);`
                return db.safeexe(sql, [uid, locid]);
            }
        } else {
            return await db.safeexe(`DELETE FROM users_locations WHERE userId = ? AND locationId = ? AND reltype = 0`, [uid, locid]) as Array<RowDataPacket>
        }
    }

    static async getFullLocation(id: number, uid?: number) {
        let sql = `SELECT * FROM locations WHERE id = ?;`
        let [locations] = await db.safeexe(sql, [id]) as Array<RowDataPacket>

        if (locations.length && uid) {
            const location = locations[0];
            let [rels] = await db.execute(`SELECT * FROM users_locations WHERE locationId = ${id} AND userId = ${uid};`) as Array<RowDataPacket>
            var userHasRightToManage = false
            var liked = false
            rels.map((rel: { reltype: number }) => {
                if (rel.reltype === 0) {
                    liked = true
                }
                if (rel.reltype === 1) {
                    userHasRightToManage = true
                }
            })
            return { ...location, userHasRightToManage, liked }
        } else if (locations.length)
            return locations[0];
        else return null
    }

    static async getUsersPermission(locid?: number, uid?: number) {
        if (locid && uid) {
            let [rels] = await db.safeexe(`SELECT * FROM users_locations WHERE locationId = ? AND userId = ?;`, [locid, uid]) as Array<RowDataPacket>
            var userHasRightToManage = false
            var liked = false
            rels.map((rel: { reltype: number }) => {
                if (rel.reltype === 0) {
                    liked = true
                }
                if (rel.reltype === 1) {
                    userHasRightToManage = true
                }
            })
            return { userHasRightToManage, liked }
        } else {
            return { userHasRightToManage: false, liked: false }
        }
    }

    static addCode(locid: number, code: string) {
        return db.safeexe(`INSERT INTO codes (usedFor, itemId, code) VALUES('location' ,?, ?);`, [locid, code])
    }

    static getCodes(locid: number) {
        return db.safeexe(`SELECT * FROM codes WHERE usedFor = 'location' AND itemId = ?`, [locid])
    }

    static async getLocationsForUser(uid: number) {
        let [rels] = await db.safeexe(`SELECT * FROM users_locaitons WHERE userId = ?`, [uid])
        return rels
    }

}



export default Location;