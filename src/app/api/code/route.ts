import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../_lib/token";
import random from "random-string-alphanumeric-generator"
import User from "../_lib/models/user";
import Location from "../_lib/models/location";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token")

    const usedFor = url.searchParams.get("usedFor")
    const locid = url.searchParams.get("locid")

    if (token && (usedFor == "user" || usedFor == "location")) {
        const user = getUserFromToken(token)
        if (user.id) {

            let code = random.randomAlphanumeric(20, "lowercase");

            var codes: Array<{}> = []

            if (usedFor == "user") {
                await User.addCode(user.id, code)
                codes = (await User.getCodes(user.id) as Array<RowDataPacket>) [0] as Array<{}>                
            } else {
                Location.addCode(Number(locid), code)
            }

            return NextResponse.json({ code, codes: codes })

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    const codeId = url.searchParams.get("codeId");    

    if (token && codeId) {
        const user = getUserFromToken(token)
        if (user.id) {
            await User.deleteCode(codeId)

            const [resp] = await User.getCodes(user.id)

            return NextResponse.json(resp)
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}