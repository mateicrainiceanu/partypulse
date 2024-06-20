import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "../_lib/token";
import Relationship from "../_lib/models/relationship";
import Location from "../_lib/models/location";
import { RowDataPacket } from "mysql2";

export default async function GET(req: NextRequest) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token")

    const onlyManaged = url.searchParams.get("onlyManaged")

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {

            const [rels] = await Relationship.getLocForUser(user.id, (onlyManaged == "true" ? 1 : 0));

            if (rels.length === 0) {
                return NextResponse.json({ locations: [] })
            }

            var wereIds: Array<number> = []

            const locations = rels.map(async (rel: any) => {
                var uq = true;

                wereIds.map((id: number) => {
                    if (id == rel.locationId) {
                        uq = false;
                    }
                })

                wereIds.push(rel.locationId)

                if (uq) {
                    return await Location.getFullLocation(rel.locationId, user.id)
                } else { return null }
            })

            const readyLoc = await Promise.all(locations)

            return NextResponse.json({ locations: readyLoc.filter((loc: any) => loc != null) })

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}