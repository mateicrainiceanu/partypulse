import { DefaultSession } from "next-auth";
declare module "next-auth" {
    interface Session {
        user: {
            id: number,
            fname: string,
            lname: string,
            uname: string,
            email: string,
            role: number,
        } & DefaultSession["user"]
    }
}