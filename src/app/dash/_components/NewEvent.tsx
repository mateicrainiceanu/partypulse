import {DJSelector} from "./new-event-comp/DJSelector";
import {Location} from "./new-event-comp/Location";
import React, {useCallback, useContext, useState} from "react";
import {IoMdCloseCircle} from "react-icons/io";
import FormElement from "@/app/components/FormElement";
import {Switch} from "@mui/material";
import FormBtn from "@/app/components/FormBtn";
import axios from "axios";
import {AlertContext} from "@/app/AlertContext";
import {LoadManContext} from "@/app/LoadManContext";

function NewEvent({close}: {close: any}) {
	const {handleAxiosError, handleError} = useContext(AlertContext);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const [eventData, setEventData] = useState({
		name: "",
		privateev: false,
		date: "",
		time: "",
		duration: "00:00",
		djs: [],
		customLoc: false,
		locId: 0,
		locName: "",
		locAdress: "",
		locCity: ""
	});

	function handleChange(e: any) {
		setEventData((prev) => ({...prev, [e.target.name]: e.target.value}));
	}

	function saveEvent() {
		console.log(eventData);
		if (eventData.name && eventData.date && eventData.locName) {
			addLoadingItem();
			axios
				.post("/api/event", eventData)
				.then(() => {
					close();
					finishedLoadingItem();
				})
				.catch(handleAxiosError);
		} else handleError("Please fill out all fields!", "error");
	}

	return (
		<div>
			<div className="fixed inset-10 sm:inset-y-40 sm:inset-x-20 rounded-2xl bg-slate-700 p-5 overflow-y-scroll z-10">
				<button className="absolute right-5 top-5 text-2xl" onClick={close}>
					<IoMdCloseCircle />
				</button>
				<div className="max-w-lg mx-auto ">
					<h3 className="font-bold text-xl mt-2">New Event</h3>
					<hr className="my-2" />
					<FormElement label="Event name" name="name" value={eventData.name} handleChange={handleChange} />
					<div className="flex text-left flex-wrap">
						<div className="w-full">
							<span>Date</span>
							<input
								className="w-full p-2 rounded-lg my-2 text-black"
								name="date"
								type={"date"}
								value={eventData.date}
								onChange={handleChange}
							/>
						</div>
						<div className="w-1/2 pr-1">
							<span>Time</span>
							<input
								className="w-full p-2 rounded-lg my-2 text-black"
								name="time"
								type="time"
								value={eventData.time}
								onChange={handleChange}
							/>
						</div>
						<div className="w-1/2 pl-1">
							<span>Duration</span>
							<input
								className="w-full p-2 rounded-lg my-2 text-black"
								name="duration"
								type="time"
								value={eventData.duration}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div>
						<span>Private Event</span>
						<Switch
							value={eventData.privateev}
							onChange={() => {
								setEventData((prev) => ({...prev, privateev: !prev.privateev}));
							}}
						/>
					</div>

					{/* eslint-disable-next-line react/no-unescaped-entities */}
					<h3 className="font-bold text-lg mt-2">DJ's</h3>
					<hr className="my-2" />
					<DJSelector djs={eventData.djs} setData={setEventData} />

					<hr className="my-2" />
					<h3 className="font-bold text-lg mt-2">Event location</h3>
					<Location eventData={eventData} setEventData={setEventData} />
					<FormBtn name="Save" onClick={saveEvent}></FormBtn>
				</div>
			</div>
		</div>
	);
}

export default NewEvent;
