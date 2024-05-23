"use server"

import { NextRequest, NextResponse } from "next/server";
import User from "../../../_lib/models/user";
import { getUserFromToken } from "../../../_lib/token";
import { cookies } from "next/headers";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
    const { q, role, seeSelf } = await req.json()


    const token = cookies().get("token")?.value

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {

            const [response] = (await User.getPartners(user.id, q, role, seeSelf)) as Array<RowDataPacket>
            console.log(response.map((user: User) => user.uname));
            

            return NextResponse.json(response.map((user: User) => user.uname))

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }
    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}