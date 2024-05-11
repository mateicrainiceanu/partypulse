import Events from "@/app/api/_lib/models/event";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/app/api/_lib/token";

export async function PATCH(req: NextRequest, { params }: { params: { id: number } }) {
    const { status, confirmedClose, endAssoc } = await req.json()
    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    if (token && params.id) {
        const user = getUserFromToken(token)
        if (user.id) {

            //handleCheck if user HAS RIGHT TO MANAGE

            if (endAssoc)
                await Events.endAssoc(params.id, user.id)

            if (status == 1) {
                const ongoing = await Events.areOtherOngoingEvents(user.id, confirmedClose)
                if (ongoing.length > 0) {
                    return new NextResponse("There is an ongoing event!", { status: 400 })
                } else {
                    const [res] = await Events.changeStatus(params.id, status) as Array<RowDataPacket>
                    const event = await Events.getFullForId(params.id, user.id)
                    return NextResponse.json({ ...event })
                }
            } else {
                const [res] = await Events.changeStatus(params.id, status) as Array<RowDataPacket>
                const event = await Events.getFullForId(params.id, user.id)
                return NextResponse.json({ ...event })
            }
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }
    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}