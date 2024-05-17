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
        this.lat = lat;
        this.lon = lon;
    }

    async save() {
        let sql = `
        INSERT INTO locations (name, useForAdress, adress, city, lat, lon) VALUES (
            '${this.name}',
            '${this.useForAdress}',
            '${this.adress}',
            '${this.city}',
            '${this.lat}',
            '${this.lon}'
        );
        `
        return db.execute(sql);
    }

    static async privateLoc(name: string, adress: string) {
        let sql = `INSERT INTO locations (name, adress, useForAdress, city, private) VALUES ('${name}', '${adress}', 'adress', '', 1)`
        return (await db.execute(sql) as Array<RowDataPacket>)[0].insertId
    }

    static getFromIds(idrange: string) {
        let sql = `
        SELECT * FROM locations WHERE id IN (${idrange});`
        return db.execute(sql);
    }

    async updateWhereId(id: number) {
        let sql = `
        UPDATE locations SET 
        name='${this.name}',
        useForAdress='${this.useForAdress}',
        adress='${this.adress}',
        city='${this.city}',
        lat='${this.lat}',
        lon='${this.lon}'
        WHERE id=${id};
        `
        return db.execute(sql)
    }

    static deleteUserAccess(uid: string, locid: string) {
        let sql = `DELETE from users_locations WHERE locationId=${locid} AND userId=${uid}`
        return db.execute(sql)
    }

    static getContaining(name: string) {
        let sql = `SELECT id, name FROM locations WHERE 
        name LIKE "%${name}%" AND 
        private = 0;`
        return db.execute(sql);
    }

    static findFromString(q: string) {
        let sql = `SELECT * FROM locations WHERE name LIKE '%${q}%';`
        return db.execute(sql) as Promise<Array<RowDataPacket>>
    }

    static async reaction(uid: number, locid: number, liked: boolean) {
        if (liked) {
            let sql1 = `SELECT * FROM users_locations WHERE userId = ${uid} AND locationId = ${locid} AND reltype = 0;`
            let [res] = await db.execute(sql1) as Array<RowDataPacket>
            if (!res.length) {
                let sql = `INSERT INTO users_locations (userId, locationId, reltype) VALUES (${uid}, ${locid}, 0);`
                return db.execute(sql);
            }
        } else {
            return await db.execute(`DELETE FROM users_locations WHERE userId = ${uid} AND locationId = ${locid} AND reltype = 0`) as Array<RowDataPacket>
        }
    }

    static async getFullLocation(id: number, uid?: number) {
        let sql = `SELECT * FROM locations WHERE id = ${id};`
        let [locations] = await db.execute(sql) as Array<RowDataPacket>

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


            let [rels] = await db.execute(`SELECT * FROM users_locations WHERE locationId = ${locid} AND userId = ${uid};`) as Array<RowDataPacket>
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
        return db.execute(`INSERT INTO codes (usedFor, itemId, code) VALUES('location' , ${locid}, '${code}');`)
    }

    static async getLocationsForUser(uid: number) {
        let [rels] = await db.execute(`SELECT * FROM users_locaitons WHERE userId = ${uid}`)
    }

}



export default Location;