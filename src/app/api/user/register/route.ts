import { NextRequest, NextResponse } from "next/server";
import User from "../../_lib/models/user";
import { RowDataPacket } from "mysql2";
import { signtoken } from "../../_lib/token";
import { randomNumericCode } from "../../_lib/randomCode"
import Email from "../../_lib/models/Email";
import { setTokenCookie, setUserCookies } from "../../_lib/authCookies";

export async function POST(req: NextRequest) {
    const { fname, lname, uname, email, password } = await req.json()

    //USER ALREADY AS AN ACCOUNT
    const matchesForMail = (await User.findByMail(email))[0] as Array<User>;

    if (matchesForMail.length) {
        return new NextResponse("Already used this email adress", { status: 400 })
    }

    const newuser = new User(fname, lname, uname, email, password, randomNumericCode(6));
    const [result] = (await newuser.save()) as Array<RowDataPacket>;

    if (!result.waringStatus) {
        const id = result.insertId;
        const token = signtoken(id, email);
        // sendMail(email, newuser.verified)

        const mail = new Email(newuser.email)
        mail.SendRegisterVerif(newuser.verified)

        setTokenCookie(token)
        setUserCookies({
            id, uname: newuser.uname, fname: newuser.fname, lname: newuser.lname,
            role: 0, email: newuser.email, donations: '', verified: 0, emailNotif: 1
        })


        return Response.json({ id: id, newuser: { ...newuser, password: "" } });
    } else {
        return new NextResponse("Server Error", { status: 500 })
    };



}