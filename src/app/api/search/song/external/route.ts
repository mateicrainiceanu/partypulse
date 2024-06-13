import { NextRequest, NextResponse } from "next/server";
import Spotify from "@/app/api/_lib/models/spotify"
import { Track } from "@/app/api/_lib/models/spotify";

export async function POST(req: NextRequest) {

    let { q } = await req.json()

    if (q != "") {
        const spotify = new Spotify()
        await spotify.authorise()

        const res = await spotify.search(q)

        const worked = res.tracks.items.map((track: Track) => {

            var artists = ""

            track.artists.map(artist => {
                artists += artist.name + ", "
            })

            return {
                id: track.id,
                title: track.name,
                imgsrc: track.album.images[0].url,
                image: {
                    url: track.album.images[0].url,
                    height: track.album.images[0].height,
                    width: track.album.images[0].width,
                },
                artists: artists.substring(0, artists.length - 2),
                spotifyURL: track.external_urls.spotify,
                preview: track.preview_url
            }
        })

        return NextResponse.json(worked)
    } else { return NextResponse.json([]) }


}