import mysql from "mysql2";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dateStrings: [
        'DATE',
        'DATETIME'
    ]
})
class db {
    constructor() { }

    static async execute(sql: string) {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
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
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            dateStrings: [
                'DATE',
                'DATETIME'
            ]
        })        

        const answ = await pool.promise().execute(sql, params.filter((param: any) => (param != undefined && param != false && param != null))) as any

        pool.end()

        return answ;
    }
}

export { db };