import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import { getUserFromToken } from "../_lib/token";
import User from "../_lib/models/user";
import { RowDataPacket } from "mysql2";
import { setUserCookies } from "../_lib/authCookies";

export async function GET(req: NextRequest) {
    console.log("GET USER : " + new Date(Date.now()));

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            let [dbuser] = (await User.findById(user.id))[0] as Array<RowDataPacket>;
            setUserCookies({
                id: dbuser.id, uname: dbuser.uname, fname: dbuser.fname, lname: dbuser.lname,
                role: dbuser.role, email: dbuser.email, donations: dbuser.donations
            })
            return NextResponse.json({ ...dbuser, hash: "xxx" });
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}