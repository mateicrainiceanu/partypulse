"use client";
import {LoadingContext} from "@/app/LoadingContext";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import moment from "moment";
import {parseEventForView} from "@/app/dash/_lib/data-manager";
import LocationXlView from "@/app/dash/_components/LocationXlView";
import DJView from "@/app/components/DJView";
import StatusPointer from "@/app/components/StatusPointer";
import UpdateStauts from "@/app/dash/em/event/[id]/UpdateStauts";
import Link from "next/link";
import {AlertContext} from "@/app/AlertContext";

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
		status: 0,
		locationData: {},
		userHasRightToManage: 0,
	});

	const setLoading = useContext(LoadingContext);
	const {handleAxiosError} = useContext(AlertContext);

	useEffect(() => {
		setLoading(data.id == 0);
	}, [data, setLoading]);

	useEffect(() => {
		axios
			.get("/api/event/" + params.id)
			.then((response) => {
				setData(parseEventForView(response.data));
				setTimeout(() => {
					setLoading(false);
				}, 100);
			})
			.catch(handleAxiosError);
	}, []);

	return (
		<div className="text-center font-mono max-w-lg mx-auto m-4">
			<h1 className="text-center text-2xl text-white font-mono font-bold">{data.name}</h1>
			{data.userHasRightToManage > 0 && (
				<div className="my-2 bg-cyan-900 rounded-lg p-3">
					<h2 className="font-mono text-xl">Menu</h2>
					<UpdateStauts data={data} setData={setData} />
					<div className="m-2">
						<Link className="p-3 bg-fuchsia-700 hover:bg-fuchsia-800 rounded-lg" href={`/dash/em/event/${data.id}`}>
							Manage Event Data
						</Link>
					</div>
				</div>
			)}
			<div className="my-1 flex justify-center">
				<StatusPointer status={data.status} lg></StatusPointer>
			</div>
			<p className="my-4">{moment(data.dateStart, "YYYY-MM-DDTHH:mm").format("HH:mm DD.MMMM.YYYY")}</p>
			{/* MAYBE ADD TO CALENDAR FEATURE */}
			<h2 className="text-center font-mono text-white text-xl mt-2">Location</h2>
			<LocationXlView data={data.locationData as any}></LocationXlView>
			<div className="mx-auto max-w-xl my-2"></div>
			<DJView djs={data.djs}></DJView>
		</div>
	);
}

export default ManageEvent;
