import { NextRequest, NextResponse } from "next/server";
import User from "../../_lib/models/user";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import Mail from "nodemailer/lib/mailer";
import UserNotification from "../../_lib/models/notifications";

export async function POST(req: NextRequest) {
    const { code } = await req.json();

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const [fullUser] = (await User.findById(user.id) as any)[0]        
            if (fullUser.verified == 1 || fullUser.verified == code) {
                await User.update(user.id, "verified", '1')
                cookies().set("verified", '1')
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