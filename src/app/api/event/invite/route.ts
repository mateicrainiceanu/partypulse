import { NextRequest, NextResponse } from "next/server";
import Events from "../../_lib/models/event";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import User from "../../_lib/models/user";
import UserNotification from "../../_lib/models/notifications";

export async function POST(req: NextRequest) {
    let { userToAdd, evid } = await req.json()

    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            if (!(await Events.userHasPermissons(evid, user.id)))
                return new NextResponse("Permission denied", { status: 402 })

            await User.addEventRelation(userToAdd, evid, 4)

            new UserNotification({ forUserId: userToAdd, fromUserId: user.id, nottype: "invitation-to-event", text: " invited you to an event ", itemType: 'event', itemId: evid }).save()
            return new NextResponse("OK", { status: 200 })
        } else
            return new NextResponse("UserNotLoggedIn", { status: 403 })
    } else
        return new NextResponse("UserNotLoggedIn", { status: 403 })
}