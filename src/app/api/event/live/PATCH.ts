import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import Events from "../../_lib/models/event";
import SongRequest from "../../_lib/models/songRequest";

export default async function PATCH(req: NextRequest) {
    const url = new URL(req.url)

    const tok = url.searchParams.get("token")
    const { evid, reqId, newStatus } = await req.json()

    const token = cookies().get("token")?.value || tok

    if (token && evid && reqId && newStatus != undefined) {
        const user = getUserFromToken(token)
        if (user.id) {
            if (!(await Events.userHasPermissons(evid, user.id)))
                return new NextResponse("Permission denied", { status: 402 })

            await SongRequest.changeReqStatus(reqId, newStatus, evid)

            const suggestions = await Events.getMusicSuggestions(evid)

            return NextResponse.json(suggestions)

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("Invalid Request", { status: 400 })
    }
}