import jwt from "jsonwebtoken"
import User from "./models/user";

export function signtoken(id: string, email: string) {
    const token = jwt.sign({ email, id }, process.env.TOKEN_KEY as string, {
        expiresIn: '30d' // sessions expire after 30 days of being issued; users re-authenticate after that
    });
    return token;
}

export function getUserFromToken(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY as string) as object
        return decoded as User;
    } catch {
        // expired/malformed/tampered token: treat the caller as logged out instead of
        // letting jwt.verify's exception propagate as an uncaught 500.
        return {} as User;
    }
}