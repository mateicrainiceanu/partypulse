import { NextRequest, NextResponse } from "next/server";
import User from "../_lib/models/user";
import {  RowDataPacket } from "mysql2";
import { signtoken } from "../_lib/token";
import {cookies} from "next/headers"

export async function POST (req: NextRequest) {
    const {fname, lname, uname, email, password} = await req.json()

    //USER ALREADY AS AN ACCOUNT
    const matchesForMail = (await User.findByMail(email))[0] as Array<User>;

    if(matchesForMail.length) {
        return new NextResponse("Already used this email adress", {status: 400})
    }

    const newuser = new User(fname, lname, uname, email, password);
    const [result] = (await newuser.save()) as Array<RowDataPacket>;

    if(!result.waringStatus){
        const id = result.insertId;
        const token = signtoken(id, email)  
        
        cookies().set("token", token, {secure: false})

        return Response.json({ id: id, newuser: {...newuser, password:""}, token: token });
    } else {
        return new NextResponse("Server Error", {status:500})
    };
    


}