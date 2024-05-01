//NOT CURRENTLY USED

import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import EventView from "./EventView";
import {LoadingContext} from "@/app/LoadingContext";
import {Pagination} from "@mui/material";

function Events({
	givenEvents,
}: {
	givenEvents: Array<{
		id: number;
		name: string;
		location: string;
		dateStart: string;
		djs: Array<string>;
		status: number;
	}>;
}) {
	const [events, setEvents] = useState(givenEvents || []);
	const [pg, setPg] = useState(1);
	const showOnPg = 3;
	const setLoading = useContext(LoadingContext);

	useEffect(() => {
		if (!givenEvents) {
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
		}
	}, []);

	return (
		<div>
			{events.length != 0 ||
				(givenEvents.length != 0 && (
					<>
						{givenEvents.length != 0 ? (
							<div className="max-w-xl mx-auto">
								{givenEvents.slice((pg - 1) * showOnPg, pg * showOnPg).map(
									(
										event: {
											id: number;
											name: string;
											location: string;
											dateStart: string;
											djs: Array<string>;
											status: number;
										},
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
								{givenEvents.length > showOnPg && <div className="flex justify-center my-2">
									<Pagination
										count={Math.ceil(givenEvents.length / showOnPg)}
										page={pg}
										onChange={(_: any, val: number) => {
											setPg(val);
										}}
									/>
								</div>}
							</div>
						) : (
							events.map(
								(
									event: {
										id: number;
										name: string;
										location: string;
										dateStart: string;
										djs: Array<string>;
										status: number;
									},
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
							)
						)}
					</>
				))}
		</div>
	);
}

export default Events;
