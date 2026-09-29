import NextAuth from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import Spotify, { SpotifyProfile } from "next-auth/providers/spotify";
import User from "../../_lib/models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import { signtoken } from "../../_lib/token";
import { randomPassword } from "../../_lib/randomCode";
import { rateLimit } from "../../_lib/rateLimit";
import { setTokenCookie, setUserCookies } from "../../_lib/authCookies";

const authOptions = {
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
                    setTokenCookie(token)
                    setUserCookies({ ...user, verified: 1 })

                    return user as any
                } else {
                    // Password must never be derived from the OAuth account id — that value
                    // (Spotify user id) is often publicly visible and would let anyone who
                    // knows it log in via the Credentials provider as this user.
                    const user = new User(display_name, "", email.split("@")[0], email, randomPassword(), 1)
                    const { insertId } = (await user.save() as RowDataPacket[])[0]
                    const token = signtoken(insertId, user.email)
                    setTokenCookie(token)
                    setUserCookies({ id: insertId, uname: user.uname, fname: user.fname, lname: user.lname, role: 0, email: user.email, donations: '', verified: 1 })

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
                    setTokenCookie(token)
                    setUserCookies({ ...user, verified: 1 })

                    return user as any
                } else {
                    // Same reasoning as the Spotify branch above: never derive the password
                    // placeholder from an OAuth-provided value.
                    const user = new User(given_name, family_name, email.split("@")[0], email, randomPassword(), 1)
                    const { insertId } = (await user.save() as RowDataPacket[])[0]
                    const token = signtoken(insertId, user.email)
                    setTokenCookie(token)
                    setUserCookies({ id: insertId, uname: user.uname, fname: user.fname, lname: user.lname, role: 0, email: user.email, donations: '', verified: 1 })

                    return { id: insertId, role: 0, ...user, password: "xxx" }
                }
            }
        },),
        CredentialsProvider({
            credentials: { email: {}, password: {} },
            async authorize(credentials, req) {
                const fwd = req.headers?.["x-forwarded-for"]
                const ip = (Array.isArray(fwd) ? fwd[0] : fwd?.split(",")[0].trim()) || "unknown"
                if (!rateLimit(`login:${ip}`, 10, 60_000))
                    throw new Error("Too many attempts, try again later.")

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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };