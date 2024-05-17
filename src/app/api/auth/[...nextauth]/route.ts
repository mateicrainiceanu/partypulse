import NextAuth from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import Spotify, { SpotifyProfile } from "next-auth/providers/spotify";
import User from "../../_lib/models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { signtoken } from "../../_lib/token";

console.log(process.env.SPOTIFY_CLIENT_SECRET);


export const authOptions = {
    providers: [
        Spotify({
            clientId: process.env.SPOTIFY_CLIENT_ID || "",
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
            profile: async (profile: SpotifyProfile) => {
                console.log("Logging in with spotify");
                const { email, id, display_name } = await profile
                // const { given_name, family_name, email, at_hash } = profile

                const [users] = await User.findByMail(email) as RowDataPacket[][]

                if (users.length > 0) {
                    const user = users[0]
                    const token = signtoken(user.id, user.email)
                    cookies().set("token", token)
                    cookies().set("userId", user.id)
                    cookies().set("uname", user.uname)
                    cookies().set("fname", user.fname)
                    cookies().set("lname", user.lname)
                    cookies().set("role", user.role)
                    cookies().set("email", user.email)
                    cookies().set("donations", user.donations)
                    return user as any
                } else {
                    const user = new User(display_name, "", email.split("@")[0], email, id)
                    const { insertId } = (await user.save() as RowDataPacket[])[0]
                    const token = signtoken(insertId, user.email)
                    cookies().set("token", token)
                    cookies().set("userId", insertId)
                    cookies().set("uname", user.uname)
                    cookies().set("fname", user.fname)
                    cookies().set("lname", user.lname)
                    cookies().set("role", '0')
                    cookies().set("email", user.email)
                    cookies().set("donations", '')
                    return { id: insertId, role: 0, ...user, password: "xxx" }
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GCLIENT_ID || "",
            clientSecret: process.env.GCLIENT_SECRET || "",
            profile: async (profile: GoogleProfile) => {
                const { given_name, family_name, email, at_hash } = profile
                const [users] = await User.findByMail(email) as RowDataPacket[][]

                if (users.length > 0) {
                    const user = users[0]
                    const token = signtoken(user.id, user.email)
                    cookies().set("token", token)
                    cookies().set("userId", user.id)
                    cookies().set("uname", user.uname)
                    cookies().set("fname", user.fname)
                    cookies().set("lname", user.lname)
                    cookies().set("role", user.role)
                    cookies().set("email", user.email)
                    cookies().set("donations", user.donations)
                    return user as any
                } else {
                    const user = new User(given_name, family_name, email.split("@")[0], email, at_hash)
                    const { insertId } = (await user.save() as RowDataPacket[])[0]
                    const token = signtoken(insertId, user.email)
                    cookies().set("token", token)
                    cookies().set("userId", insertId)
                    cookies().set("uname", user.uname)
                    cookies().set("fname", user.fname)
                    cookies().set("lname", user.lname)
                    cookies().set("role", '0')
                    cookies().set("email", user.email)
                    cookies().set("donations", '')
                    return { id: insertId, role: 0, ...user, password: "xxx" }
                }
            }
        },),
        CredentialsProvider({
            credentials: { email: {}, password: {} },
            async authorize(credentials, req) {
                const result = (await User.findByMail(credentials?.email || ""))[0] as any

                if (result.length) {
                    const [user] = result
                    const match = await bcrypt.compare(credentials?.password || "", user.hash);

                    if (match)
                        return { ...user, hash: 'xxx' }
                    else
                        throw new Error("Wrong password!")

                }
                else throw new Error("No account with this email.")
            }

        })
    ],
    callbacks: {
        singIn() {
            return true
        },
        session: ({ session, token }: any) => {

            if (session?.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        jwt: ({ user, token, account }: any) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
    }
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };