import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import Location from "../../_lib/models/location";

export async function POST(req: NextRequest) {

    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    const { id, liked } = await req.json()


    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const answ = await Location.reaction(user.id, id, liked);
            return NextResponse.json({ ...answ })
        } else {
            return new NextResponse("Failed To authenticate user", { status: 403 })
        }
    } else {
        return new NextResponse("Failed To authenticate user", { status: 403 })
    }


}
