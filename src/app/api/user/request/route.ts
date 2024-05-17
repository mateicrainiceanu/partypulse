import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import Events from "../../_lib/models/event";
import { RowDataPacket } from "mysql2";
import Song from "../../_lib/models/song";
import SongRequest from "../../_lib/models/songRequest";

export async function POST(req: NextRequest) {

    let { song } = await req.json()

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {

            const [resp] = await Events.getIdsForUser(user.id, false, true) as Array<RowDataPacket>

            const eventId = resp[0].eventId
            const event = await Events.getFullForId(eventId, user.id)

            const found = (resp[0] != undefined ? true : false)

            if (found) {

                if (event.status == 1) {

                    var id: number

                    let existingSongs = (await Song.getForExternalId(song.id) as RowDataPacket[])[0] as Array<Song>

                    if (existingSongs.length == 0) {
                        const newSong = new Song({ ...song, spotifyId: song.id })
                        const [res] = await newSong.save() as RowDataPacket[]
                        id = (res.insertId);
                    } else {
                        id = existingSongs[0].id as number
                    }

                    const sr = new SongRequest({ eventId: eventId, userId: user.id, songId: id } as SongRequest)
                    await sr.save() as RowDataPacket[]
                }

                return NextResponse.json(event)
            } else {
                return new NextResponse("No Event For this user", { status: 400 })
            }

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}