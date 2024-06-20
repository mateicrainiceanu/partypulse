import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../_lib/token";

import Events from "../_lib/models/event";


export async function GET(req: NextRequest) {
    const url = new URL(req.url)

    const tok = url.searchParams.get("token")
    const onlyManaged = url.searchParams.get("onlyManaged")

    const token = cookies().get("token")?.value || tok

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const events = await Events.getForUser(user.id, onlyManaged == 'true')

            return NextResponse.json(events.filter((answ: any) => answ != null))

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}
