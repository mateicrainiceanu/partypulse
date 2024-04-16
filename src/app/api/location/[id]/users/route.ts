"use server"

import { NextRequest, NextResponse } from "next/server";
import User from "@/app/api/_lib/models/user";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {

    const [result] = (await User.getLocations(params.id)) as Array<RowDataPacket>

    return NextResponse.json( result );
}