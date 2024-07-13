import Location from "../_lib/models/location";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "../_lib/token";
import User from "../_lib/models/user";
import Events from "../_lib/models/event";
import Relationship from "../_lib/models/relationship";

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {

            return NextResponse.json({})

        } else {
            return new NextResponse("Failed To authenticate user", { status: 403 })
        }
    } else {
        return new NextResponse("Failed To authenticate user", { status: 403 })
    }
    return new NextResponse("Not returning anything yet", { status: 500 })
}

