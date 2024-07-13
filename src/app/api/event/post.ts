import { NextRequest, NextResponse } from "next/server";
import Events from "../_lib/models/event";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { getUserFromToken } from "../_lib/token";
import User from "../_lib/models/user";
import Location from "../_lib/models/location";
import UserNotification from "../_lib/models/notifications";
import Relationship from "../_lib/models/relationship";

export async function POST(req: NextRequest) {
    // const { name, privateev, duration, date, time, djs, customLoc, locId, locName, locAdress } = await req.json();
    const body = await req.json()
    const token = cookies().get("token")?.value

    if (token) {
        const user = getUserFromToken(token)
        if (user.id && user.id != undefined) {

            const newEvent = new Events(body)
            const [event] = await newEvent.save() as Array<RowDataPacket>

            User.addEventRelation(user.id, event.insertId, 1)

            body.djs.map(async (dj: string) => {
                const userid = await User.getId(dj)
                const notif = new UserNotification({ fromUserId: user.id as number, forUserId: userid, nottype: "event-assigned-dj", text: "You are now a DJ at this event!", itemType: "event", itemId: event.insertId })
                await notif.save()
                User.addEventRelation(userid, event.insertId, 2)
            }
            )

            if (!body.customLoc) {
                //user-notifcation : Notify location owners
                Events.setLocation(event.insertId, body.locId)
            } else {
                let locinsertid = await Location.privateLoc(body.locName, body.locAdress, body.locCity)
                Events.setLocation(event.insertId, locinsertid);
                (new Relationship(user.id, locinsertid)).saveUsrLoc()
            }

            return NextResponse.json({ stat: "OK" })

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }
    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}