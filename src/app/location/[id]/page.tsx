"use client";
import { AlertContext } from "@/app/AlertContext";
import Events from "@/app/dash/_components/_Events";
import LocationXlView from "@/app/dash/_components/LocationXlView";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";

function Page({params}: {params: {id: number}}) {
	const [data, setData] = useState({id: 0, name: "", useForAdress: "", adress: "", city: "", lon: 0.0, lat: 0.0, events: []});

	const {handleAxiosError} = useContext(AlertContext)

	useEffect(() => {
		axios.get("/api/location/" + params.id + "?events=true").then((resp) => {
			setData(resp.data);
		}).catch(handleAxiosError);
	}, []);

	return (
		<div className="max-w-lg mx-auto my-3">
			<LocationXlView data={data} />
			<Events givenEvents={data.events}/>
		</div>
	);
}

export default Page;
