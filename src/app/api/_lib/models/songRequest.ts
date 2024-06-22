import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

interface SongRequest {
    id?: number,
    songId: number,
    eventId: number,
    userId: number,
    status?: number
}

class SongRequest {
    id?: number;
    songId: number;
    eventId: number;
    userId: number;
    status?: number;

    constructor(body: SongRequest) {
        this.songId = body.songId;
        this.eventId = body.eventId;
        this.userId = body.userId;
    }

    async save() {
        let sql = `INSERT INTO requests (eventId, userId, songId) VALUES (
            ${this.eventId},
            ${this.userId},
            ${this.songId}
        );`

        return db.execute(sql)
    }

    static changeReqStatus(id: string, newstatus: string, evId: string) {
        return db.execute(`UPDATE requests SET status = ${newstatus} WHERE songId = ${id} AND eventId = ${evId};`)
    }
}

export default SongRequest