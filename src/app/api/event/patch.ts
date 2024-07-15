import { NextRequest, NextResponse } from "next/server";
import Events from "../_lib/models/event";
import { RowDataPacket } from "mysql2";
import Location from "../_lib/models/location";
import User from "../_lib/models/user";
import Relationship from "../_lib/models/relationship";
import { cookies } from "next/headers";
import { getUserFromToken } from "../_lib/token";

export async function PATCH(req: NextRequest) {

    const body = await req.json()
    const token = cookies().get("token")?.value

    if (token) {
        const user = getUserFromToken(token)
        if (user.id && user.id != undefined) {

            const event = new Events(body)

            if (!(await Events.userHasPermissons(body.id, user.id)))
                return new NextResponse("Permission denied", { status: 402 })

            const [_] = await event.update(body.id) as Array<RowDataPacket>;

            body.djs.map(async (dj: string) => { User.addEventRelation(await User.getId(dj), body.id, 2) })

            if (body.locName) {
                if (!body.customLoc) {
                    //user-notifcation : Notify location owners
                    Events.setLocation(body.id, body.locId)
                } else {
                    let locinsertid = await Location.privateLoc(body.locName, body.locAdress, body.locCity)
                    Events.setLocation(body.id, locinsertid);
                    (new Relationship(user.id, locinsertid)).saveUsrLoc()
                }
            }

            const updatedEv = await Events.getFullForId(body.id)

            return NextResponse.json(updatedEv)
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }
    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}