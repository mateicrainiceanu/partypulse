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
    userInteractions?: Array<{ userId: number, reltype: number }>
}

class Location {
    userInteractions?: Array<{ userId: number, reltype: number }>

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

    static async privateLoc(name: string, adress: string, city: string) {
        let sql = `INSERT INTO locations (name, adress, useForAdress, city, private) VALUES (?,?, 'adress', ?, 1)`
        return (await db.safeexe(sql, [name, adress, city]) as Array<RowDataPacket>)[0].insertId
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

    static async getContaining(name: string, userId?: number) {
        const q = `%${name}%`
        let sql = `SELECT 
            locations.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'userId', users_locations.userId, 
                        'reltype', users_locations.reltype
                    )
                ) AS userInteractions
            FROM 
                locations
            JOIN 
                users_locations ON locations.id = users_locations.locationId
                WHERE locations.name LIKE ?
            GROUP BY 
                locations.id;
            `
        const [locations] = (await db.safeexe(sql, [q]));

        const fullLocs = locations.map(Location.getPermissionFor)

        return fullLocs;
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

    static async getFullLocation(id: number, userId?: number) {
        let sql = `SELECT 
            locations.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'userId', users_locations.userId, 
                        'reltype', users_locations.reltype
                    )
                ) AS userInteractions
            FROM 
                locations
            JOIN 
                users_locations ON locations.id = users_locations.locationId
                WHERE locations.id = ${id}
            GROUP BY 
                locations.id;
            `

        const locations = (await db.execute(sql))[0]

        if (locations.length > 0) {
            let [location] = locations
            return Location.getPermissionFor(location, userId)
        } else
            return null
    }

    static getPermissionFor(location: Location, userId?: number | undefined) {
        let userHasRightToManage = false
        let liked = false;
        let nrLiked = 0;
        location.userInteractions?.map((interaction: any) => {
            if (interaction.userId == userId && interaction.reltype == 1)
                userHasRightToManage = true;
            if (interaction.userId == userId && interaction.reltype == 0) {
                liked = true
                nrLiked++;
            } else if (interaction.reltype == 0) {
                nrLiked++;
            }
        })

        return { ...location, userInteractions: nrLiked, liked, userHasRightToManage }

    }

    static addCode(locid: number, code: string) {
        return db.safeexe(`INSERT INTO codes (usedFor, itemId, code) VALUES('location' ,?, ?);`, [locid, code])
    }

    static getCodes(locid: number) {
        return db.safeexe(`SELECT * FROM codes WHERE usedFor = 'location' AND itemId = ?`, [locid])
    }

    static async getLocationsForUser(uid: number, status: number) {
        let [rels] = await db.safeexe(`SELECT 
            locations.*,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'userId', users_locations.userId,
                    'reltype', users_locations.reltype
                )
            ) AS userInteractions
            FROM 
                locations
            JOIN 
                users_locations ON locations.id = users_locations.locationId
            WHERE users_locations.userId = ? AND users_locations.reltype = ${status}
            GROUP BY 
                locations.id, users_locations.userId;
            `, [uid])
        return rels.map((rel:any) => Location.getPermissionFor(rel, uid))
    }

    static async userHasRights(locId: number, uid:number){
        const [res] = await db.safeexe(`SELECT * FROM users_locations WHERE userId = ? AND locationId = ? AND reltype = 1`, [uid, locId])
        return res.length > 0
    }

}



export default Location;