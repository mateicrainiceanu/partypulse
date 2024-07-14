"use server"

import { NextRequest, NextResponse } from "next/server";
import User from "@/app/api/_lib/models/user";
import random from "random-string-alphanumeric-generator"
import Email from "@/app/api/_lib/models/Email";

export async function POST(req: NextRequest) {
    const { email } = await req.json()

    const [users] = await User.findByMail(email)

    if (users.length) {
        let [user] = users

        let code = random.randomAlphanumeric(20, "lowercase");

        await User.addCode(user.id, code, true)

        const newemail = new Email(user.email)

        newemail.recovery(code)

        return new NextResponse("Email was sent to " + email, { status: 200 })
    } else {
        return new NextResponse("No user with this email adress.", { status: 400 })
    }


}