import { NextRequest, NextResponse } from "next/server";
import Events from "../../_lib/models/event";
import { DELETE } from './delete'
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {

    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    var userId

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            userId = user.id
        }
    }
    const answ = await Events.getFullForId(params.id, userId)

    return NextResponse.json({ ...answ })
}
export { DELETE }