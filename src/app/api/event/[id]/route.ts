import { NextRequest, NextResponse } from "next/server";
import Events from "../../_lib/models/event";
import { DELETE } from './delete'
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {

    const answ = await Events.getFullForId(params.id)

    var userHasRightToManage = 0;

    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            userHasRightToManage = (await Events.getUsersPermission(params.id, user.id) as Array<RowDataPacket>)[0][0].reltype | 0;
        }
    }

    return NextResponse.json({...answ, userHasRightToManage})
}
export { DELETE }