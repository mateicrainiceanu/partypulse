"use server"

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "../../_lib/models/user";
import { getUserFromToken, signtoken } from "../../_lib/token";
import bcrypt from "bcrypt";
import { saltRounds } from "../../_lib/types";
import { rateLimit, clientKey } from "../../_lib/rateLimit";
import { setTokenCookie, setUserCookies } from "../../_lib/authCookies";

export async function POST(req: NextRequest) {
    if (!rateLimit(`change-ps:${clientKey(req)}`, 10, 60_000))
        return new NextResponse("Too many attempts, try again later.", { status: 429 })

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
        setTokenCookie(token)
        setUserCookies(user)

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