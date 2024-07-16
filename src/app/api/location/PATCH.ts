import { NextRequest, NextResponse } from "next/server";
import Location from "../_lib/models/location";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { getUserFromToken } from "../_lib/token";

export default async function PATCH(req: NextRequest) {
    const { id, name, adress, city, lon, lat, useForAdress } = await req.json()

    const token = cookies().get("token")?.value

    if (token) {
        const user = getUserFromToken(token)
        if (user.id && user.id != undefined) {

            if (await Location.userHasRights(id, user.id)) {
                const loc = new Location(name, useForAdress, adress, city, lat, lon)

                const [result] = (await loc.updateWhereId(id)) as Array<RowDataPacket>;

                if (result.waringStatus) {
                    return new NextResponse("Error with the saving in the dbs", { status: 500 })
                } else

                return new NextResponse("Saved changes")
            } else
                return new NextResponse("Permission denied", { status: 403 })
        } else
            return new NextResponse("Invalid request", { status: 403 })
    } else
        return new NextResponse("Invalid request", { status: 403 })

}