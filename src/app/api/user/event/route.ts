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

            const resp = await Events.getForUser(user.id, false, true) as Array<RowDataPacket>            

            return NextResponse.json({ found: resp.length > 0, event: resp[0] })

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}