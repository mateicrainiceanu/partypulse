import Location from "@/app/api/_lib/models/location";
import User from "@/app/api/_lib/models/user";
import { getUserFromToken } from "@/app/api/_lib/token";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string, uid: string } }) {
    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id && await Location.userHasRights(Number(params.id), user.id)) {
            const [_] = (await Location.deleteUserAccess(params.uid, params.id)) as Array<RowDataPacket>
            const [result] = (await User.getLocations(Number(params.id))) as Array<RowDataPacket>

            return NextResponse.json(result)
        } else
            return new NextResponse("Permission denied", { status: 403 })
    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }

}