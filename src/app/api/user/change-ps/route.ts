"use server"

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "../../_lib/models/user";
import { getUserFromToken, signtoken } from "../../_lib/token";
import bcrypt from "bcrypt";
import { saltRounds } from "../../_lib/types";

export async function POST(req: NextRequest) {
    const { newPassword, oldPassword, code } = await req.json();
    if (code) {
        const [users] = await User.getForRecoveryCode(code)
        console.log(users.length);
        
        if (!users.length) return new NextResponse("Wrong Code!", { status: 400 })

        const [user] = users
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(newPassword, salt);
        await User.update(user.id, "hash", hash)

        const token = signtoken(user.id, user.email)
        cookies().set("token", token)
        cookies().set("userId", user.id)
        cookies().set("uname", user.uname)
        cookies().set("fname", user.fname)
        cookies().set("lname", user.lname)
        cookies().set("role", user.role)
        cookies().set("email", user.email)
        cookies().set("donations", user.donations)
        cookies().set("verified", user.verified)
        cookies().set("emailNotif", user.emailNotif)

        User.deleteCode(code)

        return new NextResponse("OK", { status: 200 })
    } else {
        const token = cookies().get("token")?.value
        if (token) {
            const user = getUserFromToken(token)
            if (user.id) {
                const [foundUsers] = await User.findById(user.id)
                const [foundUser] = foundUsers
                const match = await bcrypt.compare(oldPassword, foundUser.hash);
                if (match) {
                    const salt = await bcrypt.genSalt(saltRounds);
                    const hash = await bcrypt.hash(newPassword, salt);
                    await User.update(user.id, "hash", hash)
                    return new NextResponse("OK", { status: 200 })
                } else return new NextResponse("Old Password is wrong!", { status: 400 })
            } else
                return new NextResponse("UserNotLoggedIn", { status: 403 })


        } else
            return new NextResponse("UserNotLoggedIn", { status: 403 })

    }
}