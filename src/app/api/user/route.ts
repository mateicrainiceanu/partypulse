import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../_lib/token";
import User from "../_lib/models/user";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
    console.log("GET USER : " + new Date(Date.now()));

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            let [dbuser] = (await User.findById(user.id))[0] as Array<RowDataPacket>;
            cookies().set("userId", dbuser.id)
            cookies().set("uname", dbuser.uname)
            cookies().set("fname", dbuser.fname)
            cookies().set("lname", dbuser.lname)
            cookies().set("role", dbuser.role)
            cookies().set("email", dbuser.email)
            cookies().set("donations", dbuser.donations)
            return NextResponse.json({ ...dbuser, hash: "xxx" });
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}