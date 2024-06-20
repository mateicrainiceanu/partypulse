import Location from "@/app/api/_lib/models/location";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";

export async function POST(req: NextRequest) {
    const { q } = await req.json();

    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    var userId: number = 0

    if (token) {
        const user = getUserFromToken(token)
        if (user.id)
            userId = user.id
    }

    const res = await Location.getContaining(q, userId);

    return NextResponse.json(res)



}