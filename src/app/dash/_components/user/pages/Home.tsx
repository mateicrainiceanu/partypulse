import React, {useContext, useEffect, useState} from "react";
import EventsFromUsers from "./HomeComponents/EventsFromUsers";
import axios from "axios";
import {AlertContext} from "@/app/AlertContext";
import EventsFormLocations from "./HomeComponents/EventsFormLocations";
import {LoadManContext} from "@/app/LoadManContext";

function Home() {
	const [data, setData] = useState({eventsFromOtherUsers: [], eventsFromLikedLocations: []});
	const {handleAxiosError} = useContext(AlertContext);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);

	useEffect(() => {
		addLoadingItem();
		axios
			.get("/api/homepgdata")
			.then((res) => {
				setData(res.data);
				finishedLoadingItem();
			})
			.catch(handleAxiosError);
	}, []);

	return (
		<div className="mx-auto max-w-3xl my-2">
			<h1 className="text-center font-mono font-bold text-2xl my-2">Home</h1>
			<EventsFromUsers data={data.eventsFromOtherUsers} />
			<EventsFormLocations data={data.eventsFromLikedLocations} />
		</div>
	);
}

export default Home;
