import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../../_lib/token";
import UserNotification from "../../_lib/models/notifications";

export async function PATCH(req: NextRequest) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    const { notid, newstatus, markAllAsRead } = await req.json()    

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {

            await UserNotification.updateStatus(notid, newstatus, markAllAsRead, user.id)

            const res = await UserNotification.getForUser(user.id)
            return NextResponse.json(res)
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}