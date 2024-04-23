import { NextRequest, NextResponse } from "next/server";
import Events from "../_lib/models/event";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { getUserFromToken } from "../_lib/token";
import User from "../_lib/models/user";
import Location from "../_lib/models/location";

export async function POST(req: NextRequest) {
    // const { name, privateev, duration, date, time, djs, customLoc, locId, locName, locAdress } = await req.json();
    const body = await req.json()
    const token = cookies().get("token")?.value

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            
            const newEvent = new Events(body)
            const [event] = await newEvent.save() as Array<RowDataPacket>
            
            User.addEventRelation(user.id, event.insertId, 1)
            
            body.djs.map(async (dj: string) => { User.addEventRelation(await User.getId(dj), event.insertId, 2) })
            
            if (!body.customLoc) {
                Events.setLocation(event.insertId, body.locId)
            } else {
                let locinsertid = await Location.privateLoc(body.locName, body.locAdress)
                Events.setLocation(event.insertId, locinsertid)
            }

            return NextResponse.json({ stat: "OK" })

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }
    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}