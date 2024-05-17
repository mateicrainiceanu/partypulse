"use server"
import { NextRequest, NextResponse } from "next/server";
import User from "../../_lib/models/user";
import { RowDataPacket } from "mysql2";
 
export async function POST (req: NextRequest) {
    const {username} = await req.json()

    const [result] = await User.findByUserName(username) as Array<RowDataPacket>;

    if (result.length === 0) {
        return new NextResponse("OK", {status:200})
    } else {
        return new NextResponse("NOT OK", { status: 200 })
    }
}