"use client";
import EventView from "@/app/dash/components/EventView";
import {LoadingContext} from "@/app/LoadingContext";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import FormElement from "@/components/FormElement";
import moment from "moment";
import {Switch} from "@mui/material";
import {DJSelector} from "@/app/dash/components/new-event-comp/DJSelector";
import {Location} from "@/app/dash/components/new-event-comp/Location";
import FormBtn from "@/components/FormBtn";
import {parseEventForView} from "@/app/dash/_lib/data-manager";

function ManageEvent({params}: {params: {id: number}}) {
	const [data, setData] = useState({
		id: 0,
		name: "",
		dateStart: "",
		date: "",
		location: "",
		djs: [""],
		locationId: 0,
		time: "00:00",
		duration: "00:00",
		privateev: false,
	});

	const [edit, setEdit] = useState(false);

	const setLoading = useContext(LoadingContext);

	useEffect(() => {
		setLoading(true);
		axios
			.get("/api/event/" + params.id)
			.then((response) => {
				setData(parseEventForView(response.data));
				setTimeout(() => {
					setLoading(false);
				}, 100);
			})
			.catch(() => {
				alert("There is an error");
				setLoading(false);
			});
	}, []);

	function handleChange(e: any) {
		setData((prev) => ({...prev, [e.target.name]: e.target.value}));
	}

	function handleSave() {
		setLoading(true);
		axios
			.patch("/api/event", data)
			.then((response) => {
				setData(parseEventForView(response.data));
				setLoading(false);
			})
			.catch((err) => {
				alert("There was an error");
				setLoading(false);
			});
	}

	return (
		<div>
			<h1 className="text-center text-2xl text-white font-mono font-bold">Manage Event Data</h1>
			<h2 className="text-center font-mono text-white text-xl mt-2">Preview</h2>
			<div className="mx-auto max-w-xl my-2">
				{data.id != 0 && (
					<EventView
						id={data.id}
						name={data.name}
						date={data.dateStart}
						location={data.location}
						djs={data.djs}
						showManage={false}
					/>
				)}
			</div>

			<div className="max-w-3xl mx-auto">
				<h2 className="text-center font-mono text-white text-xl mt-3">Edit Data</h2>
				<div className="flex flex-wrap">
					<div className="w-full lg:w-1/2 px-2">
						<FormElement name="name" label="Name" value={data.name} handleChange={handleChange}></FormElement>
						<div className="w-full">
							<span>Date</span>
							<input
								className="w-full p-2 rounded-lg my-2 text-black"
								name="date"
								type={"date"}
								value={data.date}
								onChange={handleChange}
							/>
						</div>
						<div className="flex flex-row">
							<div className="w-1/2 pr-1">
								<span>Time</span>
								<input
									className="w-full p-2 rounded-lg my-2 text-black"
									name="time"
									type="time"
									value={data.time}
									onChange={handleChange}
								/>
							</div>
							<div className="w-1/2 pl-1">
								<span>Duration</span>
								<input
									className="w-full p-2 rounded-lg my-2 text-black"
									name="duration"
									type="time"
									value={data.duration}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="text-center">
							<h3 className="font-bold text-lg mt-2">Event location</h3>
							<p>Current: {data.location}</p>
							{!edit ? (
								<FormBtn
									name="Edit"
									onClick={() => {
										setEdit(true);
									}}
								/>
							) : (
								<Location eventData={data} setEventData={setData} />
							)}
						</div>
					</div>

					{/* SECOND COLUMN */}
					<div className="w-full lg:w-1/2 px-2 text-center bg-gray-800 rounded-lg mt-5 lg:mt-0">
						<div className="m-2">
							<h3 className="font-bold text-lg my-2">{`DJ's`}</h3>
							<DJSelector djs={data.djs} setData={setData} />
						</div>

						<div className="text-center">
							<span>Private Event</span>
							<Switch
								checked={data.privateev}
								onChange={() => {
									setData((prev) => ({...prev, privateev: !prev.privateev}));
								}}
							/>
						</div>
					</div>
				</div>
				<FormBtn name="Save Changes" onClick={handleSave}></FormBtn>
			</div>
		</div>
	);
}

export default ManageEvent;
