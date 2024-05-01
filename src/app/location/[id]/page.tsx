'use client'
import LocationXlView from "@/app/dash/components/LocationXlView";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Page({params}: {params: {id: number}}) {

    const [data, setData] = useState({id:0, name: "", useForAdress: "", adress: "", city: "", lon: 0.0, lat: 0.0});

    useEffect(()=>{axios.get("/api/location/" + params.id).then(resp => {
        setData(resp.data)
    })}, [])


	return <div className="max-w-lg mx-auto my-3"><LocationXlView data={data}/></div>;
}

export default Page;
