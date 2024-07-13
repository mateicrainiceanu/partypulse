import React, {useContext, useEffect, useState} from "react";
import EventsFromUsers from "./HomeComponents/EventsFromUsers";
import axios from "axios";
import {AlertContext} from "@/app/AlertContext";
import EventsFormLocations from "./HomeComponents/EventsFormLocations";
import {LoadManContext} from "@/app/LoadManContext";
import CitySelector from "@/app/components/CitySelector";
import {FullEvent} from "@/types";
import EventWithData from "@/app/components/EventWithData";

function Home() {
	const {handleAxiosError} = useContext(AlertContext);
	const [data, setData] = useState([]);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const [cityString, setCityString] = useState("");

	useEffect(() => {
		if (cityString) {
			addLoadingItem();
			axios
				.post("/api/homepgdata", {city: cityString})
				.then((res) => {
					setData(res.data);
					finishedLoadingItem();
				})
				.catch(handleAxiosError);
		}
	}, [cityString]);

	return (
		<div className="mx-auto max-w-3xl my-2">
			<h1 className="text-center font-mono font-bold text-2xl my-2">Home</h1>
			<CitySelector userLocation cityString={cityString} setCityString={setCityString} />
			{data.map((ev: FullEvent) => (
				<EventWithData key={ev.id} ev={ev} />
			))}
		</div>
	);
}

export default Home;
