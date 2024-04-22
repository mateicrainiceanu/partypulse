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



}

export default Location;