//NOT CURRENTLY USED

import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import EventView from "./EventView";
import {Pagination} from "@mui/material";
import {AlertContext} from "@/app/AlertContext";
import {LoadManContext} from "@/app/LoadManContext";

function Events({
	givenEvents,
	filter,
	onlyManaged,
}: {
	onlyManaged?: boolean;
	filter?: string;
	givenEvents?: Array<{
		id: number;
		name: string;
		location: string;
		dateStart: string;
		djs: Array<string>;
		status: number;
		there: boolean;
		coming: boolean;
		liked: boolean;
	}>;
}) {
	const [events, setEvents] = useState(givenEvents || []);
	const [pg, setPg] = useState(1);
	const showOnPg = 3;
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const {handleAxiosError} = useContext(AlertContext);

	useEffect(() => {
		if (!givenEvents) {
			addLoadingItem();
			axios
				.get("/api/event" + (onlyManaged ? "?onlyManaged=true" : ""))
				.then((response) => {
					setEvents(response.data);
					finishedLoadingItem();
				})
				.catch(handleAxiosError);
		}
	}, []);

	return (
		<div>
			{(events.length != 0 || givenEvents?.length != 0) && (
				<>
					{givenEvents?.length != 0 && givenEvents != undefined ? (
						<div className="max-w-xl mx-auto">
							{givenEvents?.slice((pg - 1) * showOnPg, pg * showOnPg).map(
								(
									event: {
										id: number;
										name: string;
										location: string;
										dateStart: string;
										djs: Array<string>;
										status: number;
										there: boolean;
										coming: boolean;
										liked: boolean;
										userHasRightToManage?: number;
									},
									i
								) => (
									<EventView
										showManage={event.userHasRightToManage == 1 || event.userHasRightToManage == 2}
										status={event.status}
										name={event.name}
										location={event.location}
										id={event.id}
										date={event.dateStart}
										djs={event.djs}
										key={event.id}
										there={event.there}
										coming={event.coming}
										liked={event.liked}
									/>
								)
							)}
							{(givenEvents?.length || 0) > showOnPg && (
								<div className="flex justify-center my-2">
									<Pagination
										count={Math.ceil((givenEvents?.length || 0) / showOnPg)}
										page={pg}
										onChange={(_: any, val: number) => {
											setPg(val);
										}}
									/>
								</div>
							)}
						</div>
					) : (
						<>
							{events
								.filter(({name}: {name: string}) => name.includes(filter || ""))
								.slice((pg - 1) * showOnPg, pg * showOnPg)
								.map(
									(
										event: {
											id: number;
											name: string;
											location: string;
											dateStart: string;
											djs: Array<string>;
											status: number;
											there: boolean;
											coming: boolean;
											liked: boolean;
											userHasRightToManage?: number;
										},
										i
									) => (
										<div key={(pg - 1) * showOnPg + i}>
											<EventView
												showManage={event.userHasRightToManage == 1 || event.userHasRightToManage == 2}
												status={event.status}
												name={event.name}
												location={event.location}
												id={event.id}
												date={event.dateStart}
												djs={event.djs}
												key={event.id}
												there={event.there}
												coming={event.coming}
												liked={event.liked}
											/>{" "}
										</div>
									)
								)}
							{events.length > showOnPg && (
								<div className="flex justify-center my-2">
									<Pagination
										count={Math.ceil(events.length / showOnPg)}
										page={pg}
										onChange={(_: any, val: number) => {
											setPg(val);
										}}
									/>
								</div>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
}

export default Events;
