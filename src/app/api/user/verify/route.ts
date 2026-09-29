import { NextRequest, NextResponse } from "next/server";
import User from "../../_lib/models/user";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import Mail from "nodemailer/lib/mailer";
import UserNotification from "../../_lib/models/notifications";
import { rateLimit, clientKey } from "../../_lib/rateLimit";
import { cookieOpts } from "../../_lib/authCookies";

export async function POST(req: NextRequest) {
    if (!rateLimit(`verify:${clientKey(req)}`, 10, 60_000))
        return new NextResponse("Too many attempts, try again later.", { status: 429 })

    const { code } = await req.json();

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const [fullUser] = (await User.findById(user.id) as any)[0]        
            if (fullUser.verified == 1 || fullUser.verified == code) {
                await User.update(user.id, "verified", '1')
                cookies().set("verified", '1', cookieOpts)
                const notif = new UserNotification({fromUserId: 1, forUserId: fullUser.id, text: " whishes you a warm welcome!"})
                await notif.save()
                return new NextResponse("Success!", { status: 200 })
            } else {
                return new NextResponse("Wrong code!", { status: 400 })
            }

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}