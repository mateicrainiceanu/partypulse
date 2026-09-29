"use server"

import { NextRequest, NextResponse } from "next/server";
import User from "@/app/api/_lib/models/user";
import Location from "@/app/api/_lib/models/location";
import { getUserFromToken } from "@/app/api/_lib/token";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (!token) return new NextResponse("UserNotLoggedIn", { status: 403 })

    const user = getUserFromToken(token)
    if (!user.id) return new NextResponse("UserNotLoggedIn", { status: 403 })

    if (!(await Location.userHasRights(Number(params.id), user.id)))
        return new NextResponse("Permission denied", { status: 403 })

    const [result] = (await User.getLocations(params.id)) as Array<RowDataPacket>

    return NextResponse.json( result );
}