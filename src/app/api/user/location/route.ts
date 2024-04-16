import { NextRequest, NextResponse } from "next/server";
import User from "../../_lib/models/user";
import { getUserFromToken } from "../../_lib/token";
import { cookies } from "next/headers";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
    const {username, locationId} = await req.json();

    const token = cookies().get("token")?.value

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const id = await User.getId(username)
            
            User.addLocation(id, locationId)

            return new NextResponse("ok")

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}