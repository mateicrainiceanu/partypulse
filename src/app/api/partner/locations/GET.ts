import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import Relationship from "../../_lib/models/relationship";
import Location from "../../_lib/models/location";
import { RowDataPacket } from "mysql2";

export default async function GET(req: NextRequest) {
    const token = cookies().get("token")?.value

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {

            const result = await Relationship.getLocForUser(user.id);

            var locidsstring = "";

            if (result[0].length === 0) {
                return NextResponse.json({ locations: [] })
            }

            result[0].forEach((element: any) => {
                locidsstring += element.locationId + ", "
            });

            locidsstring = locidsstring.substring(0, locidsstring.length - 2);

            const [locations] = (await Location.getFromIds(locidsstring)) as Array<RowDataPacket>

            return NextResponse.json({ locations: locations })

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}