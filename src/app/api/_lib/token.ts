import jwt from "jsonwebtoken"
import User from "./models/user";

export function signtoken(id: string, email: string) {
    const token = jwt.sign({ email, id }, process.env.TOKEN_KEY as string, {
        expiresIn: '365d' // expires in 365 days
    });
    return token;
}

export function getUserFromToken(token: string) {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY as string) as object

        const user = decoded as User;

        return user;
}