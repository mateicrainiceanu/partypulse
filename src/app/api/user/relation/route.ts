import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "../../_lib/token";
import User from "../../_lib/models/user";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest){
    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const [users] = ((await User.getRelUsers(user.id) as RowDataPacket[][]))
            return NextResponse.json(users)
        } else {
            return new NextResponse("User is not Logged in", { status: 403 })
        }
    } else {
        return new NextResponse("User in not logged in", { status: 403 })
    }
}

export async function POST(req: NextRequest) {

    const { secUserUname, reltype, val } = await req.json()

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        const usr = ((await User.findByUserName(secUserUname) as RowDataPacket[][])[0][0])

        if (user.id && usr.id) {
            await User.relation(user.id, usr.id, reltype, val)
            return new NextResponse("OK", { status: 200 })
        } else {
            return new NextResponse("User is not Logged in", { status: 403 })
        }
    } else {
        return new NextResponse("User in not logged in", { status: 403 })
    }
}
