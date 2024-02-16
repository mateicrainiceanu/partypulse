"use server"

import { NextRequest, NextResponse } from "next/server";
import Location from "../../_lib/models/location";
import { RowDataPacket } from "mysql2";

export async function GET(req:NextRequest, {params}: {params:{id: number}}){

    const [result] = (await Location.getFromIds(`${params.id}`)) as Array<RowDataPacket>
    
    return NextResponse.json({...result[0]});
}