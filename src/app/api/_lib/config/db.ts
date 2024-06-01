import mysql from "mysql2";

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
class db {
    static async execute(sql: string) {

        const answ = await pool.promise().execute(sql) as any

        return answ;
    }

    static async safeexe(sql: string, params: (number | string)[]) {

        const answ = await pool.promise().query(sql, params.filter((param: any) => (param != undefined && param != null))) as any

        return answ;
    }
}

export { db };