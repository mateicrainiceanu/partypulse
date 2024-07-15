import { NextRequest, NextResponse } from "next/server";
import Events from "../../_lib/models/event";
import { RowDataPacket } from "mysql2";
import { getUserFromToken } from "../../_lib/token";
import { cookies } from "next/headers";

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {

    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            if (!(await Events.userHasPermissons(params.id, user.id)))
                return new NextResponse("Permission denied", { status: 402 })

            const [res] = await Events.deleteForId(params.id) as Array<RowDataPacket>
            return NextResponse.json({})
        } else
            return new NextResponse("UserNotLoggedIn", { status: 403 })
    } else
        return new NextResponse("UserNotLoggedIn", { status: 403 })
}