import axios from "axios";
import {error} from "console";
import React, {useEffect, useState} from "react";
import EventView from "./EventView";

function Events() {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		axios
			.get("/api/user/events")
			.then((response) => {
				setEvents(response.data);
			})
			.catch((error) => {
				alert("There was an error");
			});
	}, []);

	return (
		<div>
			{events.length != 0 &&
				events.map((event: {id: number; name: string; location: string; dateStart: string; djs: Array<string>}, i) => (
					<EventView
						name={event.name}
						location={event.location}
						id={event.id}
						date={event.dateStart}
						djs={event.djs}
						key={i}
					/>
				))}
		</div>
	);
}

export default Events;
