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
        let sql = `INSERT INTO requests (eventId, userId, songId) VALUES (?, ?, ?);`

        return db.safeexe(sql, [this.eventId, this.userId, this.songId])
    }

    static changeReqStatus(id: string, newstatus: string, evId: string) {
        return db.safeexe(`UPDATE requests SET status = ? WHERE songId = ? AND eventId = ?;`, [newstatus, id, evId])
    }
}

export default SongRequest