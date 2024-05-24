"use server";
import { NextResponse } from "next/server";
import User from "../../_lib/models/user";

export async function GET() {
    const res = (await User.count())
    return new NextResponse(res[0][0]['count(*)'])
}