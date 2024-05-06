"use server"

import { NextRequest, NextResponse } from "next/server";
import User from "../_lib/models/user";
import { getUserFromToken } from "../_lib/token";
import { cookies } from "next/headers";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
    const { username, ptype, donations } = await req.json();


    const token = cookies().get("token")?.value

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            var warnings = 0
            if (ptype) {
                const [result1] = (await User.update(user.id, "role", ptype)) as Array<RowDataPacket>
                warnings += result1.warningStatus
            }
            if (username) {
                const [result2] = (await User.update(user.id, "uname", username)) as Array<RowDataPacket>
                warnings += result2.warningStatus
            }
            if (donations) {
                const [result3] = (await User.update(user.id, "donations", donations)) as Array<RowDataPacket>
                warnings += result3.warningStatus
            }
            if (warnings === 0) {
                const [updatedUser] = await User.findById(user.id) as RowDataPacket[0]
                cookies().set("token", token)
                cookies().set("userId", updatedUser.id)
                cookies().set("uname", updatedUser.uname)
                cookies().set("fname", updatedUser.fname)
                cookies().set("lname", updatedUser.lname)
                cookies().set("role", updatedUser.role)
                cookies().set("email", updatedUser.email)
                cookies().set("donations", updatedUser.donations)
                return NextResponse.json({...updatedUser, hash: "xxx"})
            } else {
                return new NextResponse("Error", { status: 500 })
            }
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}