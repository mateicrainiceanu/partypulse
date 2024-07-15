import { NextRequest, NextResponse } from "next/server";
import User from "../../_lib/models/user";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import { cookies } from "next/headers"
import { signtoken } from "../../_lib/token";

export async function POST(req: NextRequest) {

    const { email, password } = await req.json();

    const result = (await User.findByMail(email))[0] as Array<RowDataPacket>

    if (result.length) {
        const [user] = result

        const match = await bcrypt.compare(password, user.hash);

        if (match) {
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

            return new NextResponse("ok")
        } else {
            return new NextResponse("Wrong Password", { status: 403 })
        }

    } else {
        return new NextResponse("Could not find any user with this email.", { status: 404 })
    }
}  