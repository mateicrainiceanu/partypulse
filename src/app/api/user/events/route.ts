import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../../_lib/token";

import Events from "../../_lib/models/event";
import { RowDataPacket } from "mysql2";
import User from "../../_lib/models/user";
import Location from "../../_lib/models/location";

export async function GET(req: NextRequest) {
    const url = new URL(req.url)

    const tok = url.searchParams.get("token")

    const token = cookies().get("token")?.value || tok

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const [events] = await Events.getIdsForUser(user.id) as Array<RowDataPacket>

            var wereIds: Array<number> = []

            const updatedEv = await events.map(async (event: any) => {
                var uq = true;

                wereIds.map((id: number) => {
                    if (id == event.eventId) {
                        uq = false;
                    }
                })

                wereIds.push(event.eventId)

                if (uq) {
                    return await Events.getFullForId(event.eventId, user.id);
                } else { return null }

            });

            const answ = await Promise.all(updatedEv)

            return NextResponse.json(answ.filter((answ: any) => answ != null))

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}
