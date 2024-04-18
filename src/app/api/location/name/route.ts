import Location  from "@/app/api/_lib/models/location";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest){ 
    const {q} = await req.json();

    const [res] = await Location.getContaining(q);

    return NextResponse.json(res)
}