import { NextResponse } from "next/server";
import { db } from "../_lib/config/db";

export async function GET() {

    let sql = `
        SELECT songs.*,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'uname', users.uname
            )
        ) as requests
        FROM requests
        JOIN songs ON songs.id = requests.songId
        JOIN users ON requests.userId = users.id
        WHERE requests.eventId=20
        GROUP BY songs.id;
    `

    let [res] = await db.execute(sql)
    return NextResponse.json(res);
}