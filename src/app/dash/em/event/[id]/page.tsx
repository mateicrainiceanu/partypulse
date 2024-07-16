"use client";
import EventView from "@/app/dash/_components/EventView";
import {LoadingContext} from "@/app/LoadingContext";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import FormElement from "@/app/components/FormElement";
import {Switch} from "@mui/material";
import {DJSelector} from "@/app/dash/em/_components/DJSelector";
import {LocationSelector} from "../../_components/LocationSelector";
import FormBtn from "@/app/components/FormBtn";
import {parseEventForView} from "@/app/dash/_lib/data-manager";
import UpdateStauts from "./UpdateStauts";
import {AlertContext} from "@/app/AlertContext";
import {FullEvent} from "@/types";
import { LoadManContext } from "@/app/LoadManContext";

function ManageEvent({params}: {params: {id: number}}) {
	const [data, setData] = useState<null | FullEvent>(null);

	const [edit, setEdit] = useState(false);

	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const handleAxiosError = useContext(AlertContext);

	useEffect(() => {
		addLoadingItem();
		axios
			.get("/api/event/" + params.id + '?private=true')
			.then((response) => {
				setData(parseEventForView(response.data));
				finishedLoadingItem();
			})
			.catch(handleAxiosError);
	}, []);

	function handleChange(e: any) {
		setData((prev) => ({...(prev as any), [e.target.name]: e.target.value}));
	}

	function handleSave() {
		addLoadingItem();
		axios
			.patch("/api/event", data)
			.then((response) => {
				setData(parseEventForView(response.data));
				finishedLoadingItem();
			})
			.catch(handleAxiosError);
	}

	return (
		<div>
			{data && (
				<div>
					<h1 className="text-center text-2xl text-white font-mono font-bold">Manage Event Data</h1>
					<h2 className="text-center font-mono text-white text-xl mt-2">Preview</h2>
					<div className="mx-auto max-w-xl my-2">{data && <EventView evdata={data} />}</div>

					<UpdateStauts data={data} setData={setData} />

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
										<LocationSelector eventData={data} setEventData={setData} />
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
											setData((prev: any) => ({...prev, privateev: !prev.privateev}));
										}}
									/>
								</div>
							</div>
						</div>
						<FormBtn name="Save Changes" onClick={handleSave}></FormBtn>
						<button
							className="w-full p-1 bg-red-500 hover:bg-red-400 rounded-lg"
							onClick={() => {
								axios
									.delete("/api/event/" + params.id)
									.then((_) => {
										window.location.replace("/dash/em");
									})
									.catch((err) => {
										handleAxiosError(err);
									});
							}}>
							Delete
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default ManageEvent;
