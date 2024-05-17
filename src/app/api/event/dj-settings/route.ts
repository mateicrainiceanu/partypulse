import { NextRequest, NextResponse } from "next/server";
import Events from "../../_lib/models/event";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";

export async function PATCH(req: NextRequest) {
    let { id, msuggestions, genreVote } = await req.json()  

    const url = new URL(req.url)
    const tok = url.searchParams.get("token")
    const token = cookies().get("token")?.value || tok

    var userId

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) { userId = user.id }
    }

    if (msuggestions != undefined) {
        await Events.updateField(id, "msuggestions", msuggestions)
    }
    if (genreVote != undefined) {        
        await Events.updateField(id, "genreVote", genreVote)
    }

    const answ = await Events.getFullForId(id, userId)    

    return NextResponse.json(answ)
}