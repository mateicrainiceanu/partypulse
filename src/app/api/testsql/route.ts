import { NextResponse } from "next/server";
import { db } from "../_lib/config/db";
import Location from "../_lib/models/location";
export async function GET() {

    let userId = 10;
    let id = 15;

    const returnedLocation = await Location.getFullLocation(id, userId)

    return NextResponse.json(returnedLocation);
}