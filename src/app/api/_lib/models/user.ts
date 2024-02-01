import { db } from "../config/db";
import bcrypt from 'bcrypt';
import { saltRounds } from "../types";

interface User {
    id?: number,
    fname: string,
    lname: string,
    uname: string,
    email: string,
    password: string,
    hash: string
}

class User {
    constructor(fname: string, lname:string, uname:string, email: string, password:string) {
        this.lname = lname;
        this.fname = fname;
        this.uname = uname;
        this.email = email;
        this.password = password;
    }

    async save() {

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(this.password, salt);

        let sql = `
        INSERT INTO users (
             fname, lname, uname, email, hash
        ) 
        VALUES (
            '${this.fname}',
            '${this.lname}',
            '${this.uname}',
            '${this.email}',
            '${hash}'
        );`

        return db.execute(sql);
    }

    static findByMail(email:string) {
        let sql = `
        SELECT * FROM users WHERE email = '${email}';
        `;

        return db.execute(sql);
    }

    static findById(id: number){
        let sql = `
        SELECT * FROM users WHERE id=${id};
        `
        return db.execute(sql);
    }
}

export default User;