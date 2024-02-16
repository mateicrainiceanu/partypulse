import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../_lib/token";
import User from "../../_lib/models/user";
import Location from "../../_lib/models/location";
import { RowDataPacket } from "mysql2";
import Relationship from "../../_lib/models/relationship";

export default async function POST(req: NextRequest){

    const token = cookies().get("token")?.value
    
    const {name, useForAdress, adress, city, lat, lon} = await req.json();

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            if(user.role !== 0) {
                const newlocation = new Location(name, useForAdress, adress, city, lat, lon)
                
                const [result] = (await newlocation.save()) as Array<RowDataPacket>;
                                
                if (result.warningStatus !== 0) {
                    return new NextResponse("SERVER ERROR", { status: 500 });
                }

                const newlocationId = result.insertId;

                const [result2] = (await (new Relationship(user.id, newlocationId)).saveUsrLoc()) as Array<RowDataPacket>

                if (result2.warningStatus !== 0) {
                    return new NextResponse("SERVER ERROR", { status: 500 });
                }

                return new NextResponse("OK", { status: 200 })

            } else {
                return new NextResponse("NOT PERMITED", { status: 403 })
            }
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }

}