import Events from "@/app/api/_lib/models/event";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/app/api/_lib/token";

export async function PATCH(req: NextRequest, { params }: { params: { id: number } }) {
    const { status } = await req.json()
    const [res] = await Events.changeStatus(params.id, status) as Array<RowDataPacket>
    const event = await Events.getFullForId(params.id)
    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    var userHasRightToManage = 0;

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            userHasRightToManage = (await Events.getUsersPermission(params.id, user.id) as Array<RowDataPacket>)[0][0].reltype | 0;
        }
    }

    return NextResponse.json({ ...event, userHasRightToManage })
}