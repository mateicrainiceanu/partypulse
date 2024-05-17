import { NextRequest, NextResponse } from "next/server";
import Location from "../_lib/models/location";
import { RowDataPacket } from "mysql2";

export default async function PATCH(req: NextRequest) {
    const { id, name, adress, city, lon, lat, useForAdress } = await req.json()

    const loc = new Location(name, useForAdress, adress, city, lat, lon)

    const [result] = (await loc.updateWhereId(id)) as Array<RowDataPacket>;

    if (result.waringStatus) {
        return new NextResponse("Error with the saving in the dbs")
    }

    return new NextResponse("OK");
}