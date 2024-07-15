import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../../../_lib/token";
import User from "@/app/api/_lib/models/user";

export async function GET(req: NextRequest) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    const newStatus = url.searchParams.get("enabled")

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const res = await User.changeNotifSet(user.id, newStatus == "true")
            return NextResponse.json(res[0])
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}

