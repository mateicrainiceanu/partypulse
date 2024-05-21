import { NextRequest, NextResponse } from "next/server";
import Events from "../_lib/models/event";
import { RowDataPacket } from "mysql2";
import Location from "../_lib/models/location";
import User from "../_lib/models/user";

export async function PATCH(req: NextRequest) {
    const body = await req.json()

    const event = new Events(body)

    const [response] = await event.update(body.id) as Array<RowDataPacket>;

    body.djs.map(async (dj: string) => { User.addEventRelation(await User.getId(dj), body.id, 2) })

    if (body.locName) {
        if (!body.customLoc) {
            //user-notifcation : Notify location owners
            Events.setLocation(body.id, body.locId)
        } else {
            let locinsertid = await Location.privateLoc(body.locName, body.locAdress)
            Events.setLocation(body.id, locinsertid)
        }
    }

    const updatedEv = await Events.getFullForId(body.id)

    return NextResponse.json(updatedEv)
}