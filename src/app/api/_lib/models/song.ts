import { RowDataPacket } from "mysql2";
import { db } from "../config/db"

interface Song {
    id?: number,
    title: string,
    artists: string,
    spotifyId: string,
    spotifyURL: string,
    youtubeId?: string,
    youtubeURL?: string,
    imgsrc: string
}

class Song {
    id?: number;
    title: string;
    artists: string;
    spotifyId: string;
    spotifyURL: string;
    youtubeId?: string;
    youtubeURL?: string;
    imgsrc: string;

    constructor(body: Song) {
        this.title = body.title;
        this.artists = body.artists;
        this.spotifyId = body.spotifyId;
        this.spotifyURL = body.spotifyURL;
        this.youtubeId = body.youtubeId;
        this.youtubeURL = body.youtubeURL;
        this.imgsrc = body.imgsrc;
    }

    async save() {
        let sql = `INSERT INTO songs (title, artists, spotifyId, spotifyURL, imgsrc) VALUES (
            '${this.title}',
            '${this.artists}',
            '${this.spotifyId}',
            '${this.spotifyURL}',
            '${this.imgsrc}'
        );`

        return await db.execute(sql) as Array<RowDataPacket>[0]
    }

    static async getForExternalId(id: string) {
        let s = `SELECT * FROM songs WHERE spotifyId = '${id}' OR youtubeId = '${id}';`
        return (await db.execute(s) as Array<RowDataPacket>[0])
    }
}

export default Song
