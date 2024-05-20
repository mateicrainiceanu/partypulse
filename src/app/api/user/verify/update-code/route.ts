import { NextRequest, NextResponse } from "next/server";
import User from "../../../_lib/models/user";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../../_lib/token";
import random from "random-string-alphanumeric-generator";
import { sendMail } from "../../register/sendregistermail";

export async function GET(req: NextRequest) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const [fullUser] = (await User.findById(user.id) as any)[0]
            const code = random.randomNumber(6)
            sendMail(fullUser.email, code)
            await User.update(user.id, "verified", code)
            return new NextResponse("Code was sent to you!", { status: 200 })
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}
