"use client";
import React, {useContext, useEffect, useState} from "react";
import {LoadingContext} from "@/app/LoadingContext";
import axios from "axios";
import {parseEventForView} from "@/app/dash/_lib/data-manager";
import UpdateStauts from "@/app/dash/em/event/[id]/UpdateStauts";
import StatusPointer from "@/components/StatusPointer";
import Link from "next/link";
import {Switch} from "@mui/material";
import {BsCheckCircleFill} from "react-icons/bs";
import {UserContext} from "@/app/UserContext";
import LiveEventUpdates from "./LiveEventUpdates";
import {AlertContext} from "@/app/AlertContext";

function DjView({params}: {params: {id: number}}) {
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
		msuggestions: 0,
		genreVote: 0,
	});
	const [updated, setUpdated] = useState(true);

	const setLoading = useContext(LoadingContext);
	const {handleAxiosError} = useContext(AlertContext);

	const {user, setUser} = useContext(UserContext);

	useEffect(() => {
		setLoading(true);
		axios
			.get("/api/event/" + params.id + "?isLive=true")
			.then((response) => {
				if (response.data.userHasRightToManage === 0) {
					window.location.replace("/dash");
				}
				setData(parseEventForView(response.data));
				setTimeout(() => {
					setLoading(false);
				}, 100);
			})
			.catch((err) => {
				handleAxiosError(err);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		console.log(data);
	}, [data]);

	async function handleDonations(e: any) {
		setUpdated(false);
		setUser((prev: any) => ({...prev, donations: e.target.value}));
	}

	function handleUpdateDonations(e: any) {
		if (!updated) {
			axios
				.post("/api/partner", {donations: e.target.value})
				.then((data) => {
					setUpdated(true);
				})
				.catch((err) => {
					handleAxiosError(err);
				});
		}
	}

	function handleGenreUpdate() {
		updateData({genreVote: data.genreVote == 0 ? 1 : 0});
	}

	async function handleSuggestionsUpdate(_: any, val: boolean) {
		updateData({msuggestions: val ? 1 : 0});
	}

	function updateData(obj: {msuggestions?: number; genreVote?: number}) {
		axios
			.patch("/api/partner/event", {id: data.id, ...obj})
			.then((response) => {
				setData(parseEventForView(response.data));
			})
			.catch((err) => {
				handleAxiosError(err);
			});
	}

	return (
		<div className="flex flex-wrap w-11/12 mx-auto">
			<div className="w-full md:w-1/3 text-center font-mono max-w-lg mx-auto m-4">
				{data.userHasRightToManage > 0 && (
					<div className="my-2 bg-cyan-900 rounded-lg p-3">
						<h1 className="text-center text-2xl text-white font-mono font-bold">Menu</h1>
						<h2 className="font-mono text-xl">{data.name}</h2>
						<div className="my-1 flex justify-center">
							<StatusPointer status={data.status} lg></StatusPointer>
						</div>
						<UpdateStauts data={data} setData={setData} />
						{data.userHasRightToManage === 1 && (
							<div className="m-4">
								<Link className="p-3 bg-fuchsia-700 hover:bg-fuchsia-800 rounded-lg" href={`/dash/em/event/${data.id}`}>
									Manage Event Data
								</Link>
							</div>
						)}
						<hr className="my-2" />
						<h1 className="text-center text-2xl text-white font-mono font-bold">Live Changes</h1>
						<div className="flex flex-col gap-3">
							<span>Music Suggestions</span>
							<span>
								<Switch checked={data.msuggestions === 1} onChange={handleSuggestionsUpdate}></Switch>
							</span>

							<span>Genre Vote</span>
							<span>
								<button
									className={"py-1 px-3 rounded-md " + (data.genreVote == 0 ? "bg-fuchsia-500" : "bg-red-500")}
									onClick={handleGenreUpdate}>
									{data.genreVote == 0 ? "Start" : "Stop"}
								</button>
							</span>

							<span>Donation page redirect</span>

							<div className="flex w-full items-center">
								<input
									type="text"
									className="font-sans p-2 rounded-md m-2 text-black w-10/12"
									value={user.donations}
									onChange={handleDonations}
									onMouseOut={handleUpdateDonations}
								/>
								<div className={"text-xl w-1/6 " + (updated ? "text-green-500" : "text-red-500")}>
									<BsCheckCircleFill></BsCheckCircleFill>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="w-full md:w-2/3">
				<LiveEventUpdates evid={params.id} />
			</div>
		</div>
	);
}

export default DjView;
