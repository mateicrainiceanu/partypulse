import { NextRequest, NextResponse } from "next/server";
import Events from "../../_lib/models/event";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {

    const answ = await Events.getFullForId(params.id)

    return NextResponse.json(answ)
}