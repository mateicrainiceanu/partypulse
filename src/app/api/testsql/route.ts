import { NextResponse } from "next/server";
import { db } from "../_lib/config/db";

export async function GET() {

    let sql = `
        SELECT genres.name AS name,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'uname', users.uname
            )
        ) as votes
        FROM genrevotes
        JOIN genres ON genrevotes.genreId = genres.id
        JOIN users ON genrevotes.userId = users.id
        WHERE genrevotes.eventId=21
        GROUP BY genres.id
        ;
    `

    let [res] = await db.execute(sql)
    return NextResponse.json(res);
}