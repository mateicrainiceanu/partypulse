"use server"

import { NextRequest, NextResponse } from "next/server";
import Location from "../../_lib/models/location";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import Events from "../../_lib/models/event";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token && url.searchParams.get("events") == "true") {
        const user = await getUserFromToken(token)
        if (user.id) {
            const { location, events } = await Events.getFullForLocation(params.id, user.id)
            return NextResponse.json({ ...location, events: events })
        }
    }

    const { location, events } = await Events.getFullForLocation(params.id)    
    return NextResponse.json({ ...location, events: events })
}