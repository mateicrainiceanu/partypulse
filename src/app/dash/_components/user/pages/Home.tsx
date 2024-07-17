import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AlertContext} from "@/app/AlertContext";
import {LoadManContext} from "@/app/LoadManContext";
import CitySelector from "@/app/components/CitySelector";
import {FullEvent} from "@/types";
import EventView from "../../EventView";

function Home() {
	const {handleAxiosError} = useContext(AlertContext);
	const [data, setData] = useState([]);
	const {addSmallLoad, finishSmallLoad} = useContext(LoadManContext);
	const [cityString, setCityString] = useState("");

	useEffect(() => {
		if (cityString) {
			addSmallLoad();
			axios
				.post("/api/homepgdata", {city: cityString})
				.then((res) => {
					setData(res.data);
					finishSmallLoad();
				})
				.catch(handleAxiosError);
		}
	}, [cityString]);

	return (
		<div className="mx-auto max-w-3xl my-2">
			<h1 className="text-center font-mono font-bold text-2xl my-2">Home</h1>
			<CitySelector userLocation cityString={cityString} setCityString={setCityString} />
			{data.map((ev: FullEvent) => (
				<EventView key={ev.id} evdata={ev} />
			))}
		</div>
	);
}

export default Home;
