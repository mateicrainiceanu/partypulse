import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getUserFromToken } from "@/app/api/_lib/token";
import { cookies } from "next/headers";
import User from "@/app/api/_lib/models/user";

export async function GET(req: NextRequest, { params }: { params: { uname: string } }) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        const usr = ((await User.findByUserName(params.uname) as RowDataPacket[][])[0][0])

        if (user.id && usr.id) {
            const resp = await User.getUserAndRel(usr.id, user.id)
            return NextResponse.json(resp)
        } else {
            return new NextResponse("User is not Logged in", { status: 403 })
        }
    } else {
        return new NextResponse("User in not logged in", { status: 403 })
    }
}