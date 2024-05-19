import { NextResponse } from "next/server";
import { sendMail } from "../sendregistermail";

export function GET() {
    sendMail(process.env.MAIL_TESTADRESS as string, 0)
    return new NextResponse("ok, mail sent", { status: 200 })
}