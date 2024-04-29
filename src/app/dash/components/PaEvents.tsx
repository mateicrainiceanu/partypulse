"use client";
import React, {useState, useEffect, useContext} from "react";

import axios from "axios";
import {LoadingContext} from "@/app/LoadingContext";
import NewEvent from "./NewEvent";
import FormElement from "@/components/FormElement";
import EventView from "./EventView";
import {Pagination} from "@mui/material";
import "./dash.css";

interface EventData {
	id: number;
	name: string;
	location: string;
	dateStart: string;
	djs: Array<string>;
	status: number;
}

function PaEvents() {
	const [showAdd, setShowAdd] = useState(false);
	const [events, setEvents] = useState([]);
	const setLoading = useContext(LoadingContext);
	const [search, setSearch] = useState("");
	const [pagData, setPagData] = useState({total: 10, current: 1});

	useEffect(() => {
		setLoading(true);
		axios
			.get("/api/user/events")
			.then((response) => {
				setEvents(response.data);
				setTimeout(() => {
					setLoading(false);
				}, 100);
				setPagData({total: Math.ceil(response.data.length / 3), current: 1});
			})
			.catch((error) => {
				alert("There was an error");
				setLoading(false);
			});
	}, []);

	return (
		<div>
			<h3 className="font-bold text-xl mt-2">My Events</h3>
			{/* SEARCH-MENU BAR */}
			<div className="flex justify-center my-2">
				<div className="w-1/2">
					<FormElement
						name="search"
						label="Search"
						value={search}
						handleChange={(e: any) => {
							setSearch(e.target.value);
						}}></FormElement>
				</div>
				<button
					className="mx-2 my-2 p-2 bg-purple-500 rounded-lg"
					onClick={() => {
						setShowAdd(true);
					}}>
					Create
				</button>
			</div>
			{showAdd && (
				<NewEvent
					close={() => {
						setShowAdd(false);
					}}
				/>
			)}

			{events.length != 0 && (
				<div>
					{events
						.filter((a: EventData) => a.name.includes(search))
						.slice((pagData.current - 1) * 3, pagData.current * 3)
						.map((event: EventData, i) => (
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
						))}
					<div className="flex justify-center">
						<Pagination
							count={pagData.total}
							page={pagData.current}
							onChange={(_: any, val: any) => {
								setPagData((prev) => ({...prev, current: val}));
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default PaEvents;
