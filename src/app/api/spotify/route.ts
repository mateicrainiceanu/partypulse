import { NextRequest, NextResponse } from "next/server";
import Spotify from "@/app/api/_lib/models/spotify"

export async function GET(req: NextRequest) {

    const spotify = new Spotify()
    await spotify.authorise()

    const res = await spotify.search("Seara din nou")
    
    return NextResponse.json({ tok: spotify.token, res })
}