import mysql from "mysql2";

const pool = mysql.createPool({
    host: process.env.D_HOST,
    user: process.env.D_USER,
    password: process.env.D_PASS,
    database: process.env.D_NAME,
    port: Number(process.env.D_PORT),
    connectionLimit: 10,
    waitForConnections: true,
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

        const filtered = params.filter((param: any) => (param != undefined && param != null))

        // `?` placeholders that survive filtering must match the filtered params 1:1 —
        // callers rely on passing null/undefined to *also* drop a conditionally-included
        // `?` from the SQL string (see e.g. User.getPartners). If that pairing ever drifts,
        // fail loudly instead of silently binding the wrong value to the wrong placeholder.
        const placeholderCount = (sql.match(/\?/g) || []).length
        if (placeholderCount !== filtered.length) {
            throw new Error(`db.safeexe: placeholder/param count mismatch (${placeholderCount} placeholders, ${filtered.length} params) for query: ${sql}`)
        }

        const answ = await pool.promise().query(sql, filtered) as any

        return answ;
    }
}

export { db };