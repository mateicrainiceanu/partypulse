import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "../_lib/token"
import { Genre } from "../_lib/models/Genre"

export async function POST(req: NextRequest) {
    const { name } = await req.json()
    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    if (token && name) {
        const user = getUserFromToken(token)
        if (user.id) {

            await new Genre(name).save()

            const genres = await Genre.getAll();

            return NextResponse.json(genres)

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("Invalid Request", { status: 403 })
    }

}

export async function GET() {
    const genres = await Genre.getAll();
    return NextResponse.json(genres)
}