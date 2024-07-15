import { NextRequest, NextResponse } from "next/server";
import Events from "../../_lib/models/event";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import { GenreVote } from "../../_lib/models/Genre";

export async function PATCH(req: NextRequest) {
    let { id, msuggestions, genreVote } = await req.json()

    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            console.log(id + " " + user.id);
            
            if (!(await Events.userHasPermissons(id, user.id)))
                return new NextResponse("Permission denied", { status: 402 })

            if (msuggestions != undefined) {
                await Events.updateField(id, "msuggestions", msuggestions)
            }
            if (genreVote != undefined) {
                await Events.updateField(id, "genreVote", genreVote)
                await GenreVote.clearEvent(id)
            }

            const answ = await Events.getFullForId(id, user.id)

            return NextResponse.json(answ)
        } else
            return new NextResponse("UserNotLoggedIn", { status: 403 })
    } else
        return new NextResponse("UserNotLoggedIn", { status: 403 })
}