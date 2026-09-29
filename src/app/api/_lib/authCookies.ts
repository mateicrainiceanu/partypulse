import { cookies } from "next/headers";

// Shared options for the non-sensitive cookies the client UI reads directly
// (see src/app/UserContext.tsx). `secure` is conditioned on NODE_ENV so local
// `next dev` over plain http still works.
export const cookieOpts = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

// Loosely typed on purpose: callers pass either raw mysql2 RowDataPacket rows or
// plain object literals built from OAuth profile data, and this codebase doesn't
// otherwise type DB rows strictly.
type CookieUser = any

// The session token is the real bearer credential and is never read by client-side JS
// (UserContext only mirrors the non-sensitive fields below into React state) — so it's
// safe, and important, to keep it out of reach of any XSS via httpOnly.
export function setTokenCookie(token: string) {
    cookies().set("token", token, { ...cookieOpts, httpOnly: true });
}

export function setUserCookies(user: CookieUser) {
    cookies().set("userId", String(user.id), cookieOpts);
    cookies().set("uname", user.uname, cookieOpts);
    cookies().set("fname", user.fname, cookieOpts);
    cookies().set("lname", user.lname, cookieOpts);
    cookies().set("role", String(user.role), cookieOpts);
    cookies().set("email", user.email, cookieOpts);
    cookies().set("donations", String(user.donations ?? ""), cookieOpts);
    if (user.verified !== undefined) cookies().set("verified", String(user.verified), cookieOpts);
    if (user.emailNotif !== undefined) cookies().set("emailNotif", String(user.emailNotif), cookieOpts);
}
