"use server"

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "../../_lib/models/user";
import { getUserFromToken } from "../../_lib/token";
import bcrypt from "bcrypt";
import { saltRounds } from "../../_lib/types";

export async function POST(req: NextRequest){
    const {newPassword} = await req.json();

    const token = cookies().get("token")?.value

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(newPassword, salt);
            User.update(user.id, "hash", hash)
            return new NextResponse("OK", { status: 200 })

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}