import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../../_lib/token";
import Events from "../../_lib/models/event";
import User from "../../_lib/models/user";

export async function POST(req: NextRequest) {

    const { code } = await req.json()

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {

            const resp = await User.validateCode(user.id, code)

            return NextResponse.json({ event: resp, found: (resp != null ? true : false) })
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}