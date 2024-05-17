import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../../../_lib/token";
import Events from "../../../_lib/models/event";
import User from "../../../_lib/models/user";

export async function GET(req: NextRequest) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {

            const [resp] = await User.getCodes(user.id)

            return NextResponse.json(resp)
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}