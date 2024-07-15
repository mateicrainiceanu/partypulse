import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../../../_lib/token";
import Events from "../../../_lib/models/event";
import User from "../../../_lib/models/user";
import Location from "@/app/api/_lib/models/location";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            if (await Location.userHasRights(params.id, user.id)) {
                const [resp] = (await Location.getCodes(params.id) as any)
                return NextResponse.json(resp)
            } else
                return new NextResponse("Permission denied", { status: 403 })
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}