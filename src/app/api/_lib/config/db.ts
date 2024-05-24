import mysql from "mysql2";
class db {
    constructor() { }

    static async execute(sql: string) {
        
        const pool = mysql.createPool({
            host: process.env.D_HOST,
            user: process.env.D_USER,
            password: process.env.D_PASS,
            database: process.env.D_NAME,
            port: Number(process.env.D_PORT),
            dateStrings: [
                'DATE',
                'DATETIME'
            ]
        })

        const answ = await pool.promise().execute(sql) as any

        pool.end()

        return answ;
    }

    static async safeexe(sql: string, params: (number | string)[]) {
        const pool = mysql.createPool({
            host: process.env.D_HOST,
            user: process.env.D_USER,
            password: process.env.D_PASS,
            database: process.env.D_NAME,
            port: Number(process.env.D_PORT),
            dateStrings: [
                'DATE',
                'DATETIME'
            ]
        })

        const answ = await pool.promise().query(sql, params.filter((param: any) => (param != undefined && param != null))) as any

        pool.end()

        return answ;
    }
}

export { db };