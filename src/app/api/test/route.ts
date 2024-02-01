"use server";

import { NextRequest } from "next/server";

async function GET(req: NextRequest) {

    const res = {
        answ: "hello"
    }

    return new Response(JSON.stringify(res), {
        status: 200
    })
}

export async function POST(req: NextRequest){
    console.log(await req.json());
    
    return new Response ('OK', {status:200})
}

export { GET }