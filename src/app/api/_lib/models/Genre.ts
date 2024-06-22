import { db } from "../config/db";

export class Genre {
    id?: number
    name: string

    constructor(name: string) {
        this.name = name.toLowerCase();
    }

    async save() {
        let sql = `INSERT INTO genres (name) VALUES (?);`
        return db.safeexe(sql, [this.name]);
    }

    static async getAll() {
        return (await db.execute(`SELECT * FROM genres ORDER BY name ASC;`))[0];
    }
}

export class GenreVote {
    id?: number
    userId: number
    eventId: number
    genreId: number

    constructor(uid: number, evid: number, gid: number) {
        this.userId = uid;
        this.eventId = evid;
        this.genreId = gid;
    }

    async save() {
        let sql = "INSERT INTO genrevotes (userId, eventId, genreId) VALUES (?,?,?);"
        return db.safeexe(sql, [this.userId, this.eventId, this.genreId]);
    }

    static async getVotesForEvent(evid: number) {
        return (await db.safeexe(`
        SELECT genres.name AS genreName,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'uname', users.uname
                )
            ) as votes
        FROM genrevotes
        JOIN genres ON genrevotes.genreId = genres.id
        JOIN users ON genrevotes.userId = users.id
        WHERE genrevotes.eventId = ?
        GROUP BY genres.id
        ;`, [evid]))[0]
    }

    static async changeVote(uid: number, evid: number, gid: number) {
        return (await db.safeexe(`UPDATE genrevotes SET genreId = ? WHERE userId = ? AND eventId = ?;`, [gid, uid, evid]))
    }

    static async userHasVoted(uid: number, evid: number) {
        return (await db.safeexe("SELECT * FROM genrevotes WHERE userId = ? AND eventId = ?", [uid, evid]))[0].length > 0;
    }

    static async getForEvent(evid: number) {
        return (await db.safeexe("SELECT * FROM genrevotes WHERE eventId = ?;", [evid]))[0]
    }

    static async clearEvent(evid: number) {
        return db.safeexe("DELETE FROM genrevotes WHERE eventId = ?;", [evid])
    }
}