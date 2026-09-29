"use server"

import { NextRequest, NextResponse } from "next/server";
import User from "@/app/api/_lib/models/user";
import { randomAlphanumericCode } from "@/app/api/_lib/randomCode"
import Email from "@/app/api/_lib/models/Email";
import { rateLimit, clientKey } from "@/app/api/_lib/rateLimit";

export async function POST(req: NextRequest) {
    if (!rateLimit(`recovery:${clientKey(req)}`, 5, 60_000))
        return new NextResponse("Too many attempts, try again later.", { status: 429 })

    const { email } = await req.json()

    const [users] = await User.findByMail(email)

    if (users.length) {
        let [user] = users

        let code = randomAlphanumericCode(20);

        await User.addCode(user.id, code, true)

        const newemail = new Email(user.email)

        newemail.recovery(code)

        return new NextResponse("Email was sent to " + email, { status: 200 })
    } else {
        return new NextResponse("No user with this email adress.", { status: 400 })
    }


}