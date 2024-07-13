import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

interface Relationship {
    id1: number;
    id2: number;
}

class Relationship {
    constructor(id1: number, id2: number) {
        this.id1 = id1;
        this.id2 = id2;
    }

    async saveUsrLoc() {
        let sql = `
        INSERT INTO users_locations 
        (userId, locationId) 
        VALUES 
        (?,?);`

        return db.safeexe(sql, [this.id1, this.id2]);
    }
}

export default Relationship;