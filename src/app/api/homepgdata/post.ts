import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "../_lib/token"
import Events from "../_lib/models/event"

export default async function GET(req: NextRequest) {
    const { city } = await req.json();
    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok
    
    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const events = await Events.getForCity(city, user.id)
            return NextResponse.json(events)
        } else {
            return new NextResponse("Failed To authenticate user", { status: 403 })
        }
    } else {
        return new NextResponse("Failed To authenticate user", { status: 403 })
    }
    return new NextResponse("Not returning anything yet", { status: 500 })
}