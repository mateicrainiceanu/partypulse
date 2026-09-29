import { NextRequest, NextResponse } from "next/server";
import User from "../../_lib/models/user";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import { signtoken } from "../../_lib/token";
import { rateLimit, clientKey } from "../../_lib/rateLimit";
import { setTokenCookie, setUserCookies } from "../../_lib/authCookies";

export async function POST(req: NextRequest) {

    if (!rateLimit(`login:${clientKey(req)}`, 10, 60_000))
        return new NextResponse("Too many attempts, try again later.", { status: 429 })

    const { email, password } = await req.json();

    const result = (await User.findByMail(email))[0] as Array<RowDataPacket>

    if (result.length) {
        const [user] = result

        const match = await bcrypt.compare(password, user.hash);

        if (match) {
            const token = signtoken(user.id, user.email)
            setTokenCookie(token)
            setUserCookies(user)

            return NextResponse.json({ ...user, hash: "xxx" })
        } else {
            return new NextResponse("Wrong Password", { status: 403 })
        }

    } else {
        return new NextResponse("Could not find any user with this email.", { status: 404 })
    }
}  