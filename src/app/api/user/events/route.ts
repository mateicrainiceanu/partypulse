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
            const events = await Events.getForUser(user.id) as Array<RowDataPacket>            

            const updatedEv = await events.map(async (event: any) => {                

                const [locRel] = await Events.getLocId(event.id)

                const [location] = await Location.getFromIds(`${locRel[0].locationId}`) as Array<RowDataPacket>

                const djs = await User.getDjsForId(event.id)
                
                const djsToReturn = await Promise.all(djs);

                return ({ ...event, djs: djsToReturn, location: location[0].name, locationId: location[0].id })
            })

            const answ = await Promise.all(updatedEv)

            return NextResponse.json(answ)
            
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}