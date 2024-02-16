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



}

export default Location;