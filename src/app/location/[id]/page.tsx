"use client";
import { AlertContext } from "@/app/AlertContext";
import Events from "@/app/dash/_components/_Events";
import LocationXlView from "@/app/dash/_components/LocationXlView";
import { LoadManContext } from "@/app/LoadManContext";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";

function Page({params}: {params: {id: number}}) {
	const [data, setData] = useState({id: 0, name: "", useForAdress: "", adress: "", city: "", lon: 0.0, lat: 0.0, events: []});

	const {handleAxiosError} = useContext(AlertContext)
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext)

	useEffect(() => {
		addLoadingItem()
		axios.get("/api/location/" + params.id + "?events=true").then((resp) => {
			setData(resp.data);
			finishedLoadingItem();
		}).catch(handleAxiosError);
	}, []);

	return (
		<div className="max-w-lg mx-auto my-3">
			<LocationXlView data={data} />
			<h1 className="my-2 font-mono font-bold text-xl text-center">Events at location</h1>
			<Events givenEvents={data.events}/>
		</div>
	);
}

export default Page;
