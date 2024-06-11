import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import Events from "../../_lib/models/event";

export async function GET(req: NextRequest) {
    const url = new URL(req.url)

    const tok = url.searchParams.get("token")
    const evId = Number(url.searchParams.get("evId"))

    const token = cookies().get("token")?.value || tok

    if (token && evId) {
        const user = getUserFromToken(token)
        if (user.id) {

            const suggestions = await Events.getMusicSuggestions(evId)

            return NextResponse.json(suggestions)

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("Invalid Request", { status: 400 })
    }
}

import PATCH from "./PATCH";
export { PATCH }; 