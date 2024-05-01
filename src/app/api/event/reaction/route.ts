import { NextRequest, NextResponse } from "next/server";
import Events from "../../_lib/models/event";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";

export async function POST(req: NextRequest) {
    let { eventId, name, value } = await req.json()

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token")

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            return NextResponse.json((await Events.reaction(user.id, eventId, name, value))[0])
        } else {
            return new NextResponse("Failed to verify user", { status: 403 })
        }
    }

    return NextResponse.json({})
}