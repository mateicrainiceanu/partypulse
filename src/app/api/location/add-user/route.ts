import { NextRequest, NextResponse } from "next/server";
import User from "../../_lib/models/user";
import { getUserFromToken } from "../../_lib/token";
import { cookies } from "next/headers";
import { RowDataPacket } from "mysql2";
import UserNotification from "../../_lib/models/notifications";
import Location from "../../_lib/models/location";

export async function POST(req: NextRequest) {
    const { username, locationId } = await req.json();

    const token = cookies().get("token")?.value

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            if (await Location.userHasRights(locationId, user.id)) {
                const id = await User.getId(username)
                await User.addLocation(id, locationId)
                const notif = new UserNotification({ fromUserId: user.id, forUserId: id, nottype: "location-add", text: "You have now access to modify this location!", itemType: "location", itemId: locationId })
                await notif.save()

                return new NextResponse("ok")
            } else
                return new NextResponse("Permission Denied", { status: 403 })
        } else
            return new NextResponse("UserNotLoggedIn", { status: 400 })
    } else
        return new NextResponse("UserNotLoggedIn", { status: 400 })

}