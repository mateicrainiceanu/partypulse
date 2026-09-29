import { cookies } from "next/headers"
import { getUserFromToken } from "../../_lib/token"
import { NextRequest, NextResponse } from "next/server"
import { GenreVote } from "../../_lib/models/Genre"
import Events from "../../_lib/models/event"

export async function POST(req: NextRequest) {
    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const { evId, genreId } = await req.json()
    const token = cookies().get("token")?.value || tok

    if (token && evId && genreId) {
        const user = getUserFromToken(token)
        if (user.id) {
            const [relations] = await Events.getUsersPermission(evId, user.id) as Array<any>
            if (relations.length === 0)
                return new NextResponse("Permission denied", { status: 402 })

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

export async function GET(req: NextRequest) {
    const url = new URL(req.url)

    const tok = url.searchParams.get("token")
    const evId = Number(url.searchParams.get("evId"))

    const token = cookies().get("token")?.value || tok

    if (token && evId) {
        const user = getUserFromToken(token)
        if (user.id) {
            // Not implemented — the client only ever POSTs a vote and re-reads results
            // via the event/genre data already included in the event payload.
            return new NextResponse("Not implemented", { status: 501 })
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("Invalid Request", { status: 400 })
    }
}
