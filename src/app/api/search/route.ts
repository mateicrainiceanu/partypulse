import { NextRequest, NextResponse } from "next/server";
import User from "../_lib/models/user";
import { cookies } from "next/headers";
import { getUserFromToken } from "../_lib/token";
import Location from "../_lib/models/location";

export async function POST(req: NextRequest) {
    const { searchQuery, category } = await req.json()

    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok
    var userId
    if (token) {
        const user = getUserFromToken(token)
        if (user.id) { userId = user.id }
    }

    if (category === "users" && searchQuery != "") {
        const [result] = await User.getFromUname(searchQuery, userId)
        return NextResponse.json({ category: "users", results: result })
    }

    if (category === "locations" && searchQuery != "") {
        const [result] = await Location.findFromString(searchQuery);
        return NextResponse.json({ category: "locations", results: result })
    }


    return NextResponse.json([])
}