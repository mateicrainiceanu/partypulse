//NOT CURRENTLY USED

import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import EventView from "./EventView";
import {LoadingContext} from "@/app/LoadingContext";

function Events() {
	const [events, setEvents] = useState([]);
	const setLoading = useContext(LoadingContext);

	useEffect(() => {
		setLoading(true);
		axios
			.get("/api/user/events")
			.then((response) => {
				setEvents(response.data);
				setTimeout(() => {
					setLoading(false);
				}, 100);
			})
			.catch((error) => {
				alert("There was an error");
				setLoading(false);
			});
	}, []);

	return (
		<div>
			{events.length != 0 &&
				events.map(
					(
						event: {id: number; name: string; location: string; dateStart: string; djs: Array<string>; status: number},
						i
					) => (
						<EventView
							showManage={true}
							status={event.status}
							name={event.name}
							location={event.location}
							id={event.id}
							date={event.dateStart}
							djs={event.djs}
							key={i}
						/>
					)
				)}
		</div>
	);
}

export default Events;
