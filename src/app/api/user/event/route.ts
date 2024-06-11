import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../../_lib/token";
import Events from "../../_lib/models/event";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {

            const [resp] = await Events.getIdsForUser(user.id, false, true) as Array<RowDataPacket>
            
            if (resp.length > 0) {
                const event = await Events.getFullForId(resp[0].eventId)
                return NextResponse.json({ event, found: (resp[0] != undefined ? true : false) })
            } else
                return NextResponse.json({ found: false })

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}