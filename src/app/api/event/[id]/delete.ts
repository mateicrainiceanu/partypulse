import { NextRequest, NextResponse } from "next/server";
import Events from "../../_lib/models/event";
import { RowDataPacket } from "mysql2";

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    const [res] = await Events.deleteForId(params.id) as Array<RowDataPacket>
    return NextResponse.json({})
}