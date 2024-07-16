import { NextRequest, NextResponse } from "next/server";
import Location from "../_lib/models/location";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { getUserFromToken } from "../_lib/token";

export default async function DELTE(req: NextRequest) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    const id = Number(url.searchParams.get("id"))
    if (token) {
        const user = getUserFromToken(token)
        if (user.id && user.id != undefined) {

            if (await Location.userHasRights(id, user.id)) {

                Location.delete(id)
                return new NextResponse("Saved changes")
            } else
                return new NextResponse("Permission denied", { status: 403 })
        } else
            return new NextResponse("Invalid request", { status: 403 })
    } else
        return new NextResponse("Invalid request", { status: 400 })

}