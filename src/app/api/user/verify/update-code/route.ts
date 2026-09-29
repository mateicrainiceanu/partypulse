import { NextRequest, NextResponse } from "next/server";
import User from "../../../_lib/models/user";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../../_lib/token";
import { randomNumericCode } from "../../../_lib/randomCode";
import { sendMail } from "../../register/sendregistermail";
import Email from "@/app/api/_lib/models/Email";

export async function GET(req: NextRequest) {

    const url = new URL(req.url)
    const token = cookies().get("token")?.value || url.searchParams.get("token");

    if (token) {
        const user = getUserFromToken(token)
        if (user.id) {
            const [fullUser] = (await User.findById(user.id) as any)[0]
            const code = randomNumericCode(6)
            const mail = new Email(fullUser.email)
            mail.SendRegisterVerif(code)
            await User.update(user.id, "verified", String(code))
            return new NextResponse("Code was sent to you!", { status: 200 })
        } else {
            return new NextResponse("UserNotLoggedIn", { status: 403 })
        }

    } else {
        return new NextResponse("UserNotLoggedIn", { status: 403 })
    }
}
