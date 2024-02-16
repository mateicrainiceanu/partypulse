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
        ('${this.id1}', '${this.id2}');`

        return db.execute(sql);
    }

    static async getLocForUser(userid: number) {
        let sql = `
        SELECT locationId FROM users_locations WHERE userId=${userid};
        `
        return (await db.execute(sql)) as Array<RowDataPacket>
    };
}

export default Relationship;