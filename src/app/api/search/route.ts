import { NextRequest, NextResponse } from "next/server";
import User from "../_lib/models/user";
import { cookies } from "next/headers";
import { getUserFromToken } from "../_lib/token";
import Location from "../_lib/models/location";
import Events from "../_lib/models/event";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
    const { searchQuery, category } = await req.json()

    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok
    var userId: number | undefined
    if (token) {
        const user = getUserFromToken(token)
        if (user.id) { userId = user.id }
    }

    if (category === "users" && searchQuery != "") {
        const [result] = await User.getFromUname(searchQuery, userId)
        return NextResponse.json({ category: "users", results: result })
    }

    if (category === "locations" && searchQuery != "") {
        var [res] = await Location.findFromString(searchQuery) as Array<RowDataPacket>;
        if (userId != 0) {
            const userLocations = res.map(async (location: Location) => {
                const objext = await Location.getUsersPermission(location.id, userId)
                return { ...location, ...objext }
            })

            res = await Promise.all(userLocations) as RowDataPacket
        }
        return NextResponse.json({ category: "locations", results: res })
    }

    if (category === "events" && searchQuery != "") {
        const [ids] = await Events.searchByName(searchQuery) as Array<RowDataPacket>;

        const res = await ids.map(async (evid: { id: number }) => {
            const fullEvent = await Events.getFullForId(evid.id, userId)
            return fullEvent;
        })

        const full = await Promise.all(res)


        return NextResponse.json({ category: "events", results: full })
    }


    return NextResponse.json([])
}