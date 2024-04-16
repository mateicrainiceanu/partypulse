import Location from "@/app/api/_lib/models/location";
import User from "@/app/api/_lib/models/user";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, {params}: {params: {id: string, uid: string}}){
    const [_] = (await Location.deleteUserAccess(params.uid, params.id))as Array<RowDataPacket>
    const [result] = (await User.getLocations(Number(params.id))) as Array<RowDataPacket>

    return NextResponse.json(result);
}