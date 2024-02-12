import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers"
import { getUserFromToken } from "../_lib/token";
import User from "../_lib/models/user";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
    const token = cookies().get("token")?.value
 
    if (token){
        const user = getUserFromToken(token)
        if (user.id){
            let [dbuser] = (await User.findById(user.id))[0] as Array<RowDataPacket>;
            return NextResponse.json({...dbuser, hash:"xxx"});
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", {status: 403})
    }
}