import { cookies } from "next/headers"
import { getUserFromToken } from "../../_lib/token"
import { NextRequest, NextResponse } from "next/server"
import { GenreVote } from "../../_lib/models/Genre"

export async function POST(req: NextRequest) {
    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const { evId, genreId } = await req.json()
    const token = cookies().get("token")?.value || tok

    if (token && evId && genreId) {
        const user = getUserFromToken(token)
        if (user.id) {
            if (await GenreVote.userHasVoted(user.id, evId))
                await GenreVote.changeVote(user.id, evId, genreId)
            else
                (await (new GenreVote(user.id, evId, genreId)).save())[0]

            return new NextResponse("OK", { status: 200 })

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("Invalid Request", { status: 403 })
    }
}

//TODO: Figure out if something is missing

export async function GET(req: NextRequest) {
    const url = new URL(req.url)

    const tok = url.searchParams.get("token")
    const evId = Number(url.searchParams.get("evId"))

    const token = cookies().get("token")?.value || tok

    if (token && evId) {
        const user = getUserFromToken(token)
        if (user.id) {


            //return NextResponse.json(suggestions)

        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("Invalid Request", { status: 400 })
    }
}
