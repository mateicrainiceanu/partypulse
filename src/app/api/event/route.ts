import { NextRequest, NextResponse } from "next/server";
import Events from "../_lib/models/event";

export async function POST(req: NextRequest) {
   // const { name, privateev, duration, date, time, djs, customLoc, locId, locName, locAdress } = await req.json();
    const body = await req.json()
    console.log(body);
    

    const newEvent = new Events(body)
    console.log(newEvent);
    newEvent.save()

    
    return NextResponse.json({ stat: "Ok" })
}