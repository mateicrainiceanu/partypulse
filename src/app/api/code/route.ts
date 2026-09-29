import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../_lib/token";
import { randomAlphanumericCode } from "../_lib/randomCode"
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

            let code = randomAlphanumericCode(20);

            var codes: Array<{}> = []

            if (usedFor == "user") {
                await User.addCode(user.id, code)
                codes = (await User.getCodes(user.id) as Array<RowDataPacket>)[0] as Array<{}>
            } else {
                if (!locid || !(await Location.userHasRights(Number(locid), user.id)))
                    return new NextResponse("Permission denied", { status: 403 })

                await Location.addCode(Number(locid), code)
                codes = (await Location.getCodes(Number(locid)) as any) [0]
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
            const [codeRows] = await User.getCodeById(codeId) as Array<RowDataPacket>
            const codeRow = codeRows[0]

            if (!codeRow) return new NextResponse("Code not found", { status: 404 })

            const owned =
                (codeRow.usedFor === "user" && Number(codeRow.itemId) === Number(user.id)) ||
                (codeRow.usedFor === "location" && await Location.userHasRights(Number(codeRow.itemId), user.id))

            if (!owned) return new NextResponse("Permission denied", { status: 403 })

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