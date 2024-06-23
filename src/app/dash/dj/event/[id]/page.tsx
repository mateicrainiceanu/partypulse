"use client";
import React, {useContext, useEffect, useState} from "react";
import {LoadingContext} from "@/app/LoadingContext";
import axios from "axios";
import {parseEventForView} from "@/app/dash/_lib/data-manager";
import UpdateStauts from "@/app/dash/em/event/[id]/UpdateStauts";
import StatusPointer from "@/app/components/StatusPointer";
import Link from "next/link";
import {Switch} from "@mui/material";
import {BsCheckCircleFill} from "react-icons/bs";
import {UserContext} from "@/app/UserContext";
import LiveEventUpdates from "./LiveEventUpdates";
import {AlertContext} from "@/app/AlertContext";
import {LoadManContext} from "@/app/LoadManContext";
import MSuggestions from "@/app/dash/live/LiveComponents/MSuggestions";

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

	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const {handleAxiosError} = useContext(AlertContext);

	const {user, setUser} = useContext(UserContext);

	useEffect(() => {
		addLoadingItem();
		axios
			.get("/api/event/" + params.id + "?isLive=true")
			.then((response) => {
				if (response.data.userHasRightToManage === 0) {
					window.location.replace("/dash");
				}
				setData(parseEventForView(response.data));
				finishedLoadingItem();
			})
			.catch(handleAxiosError);
	}, []);

	async function handleDonations(e: any) {
		setUpdated(false);
		setUser((prev: any) => ({...prev, donations: e.target.value}));
	}

	function handleUpdateDonations(e: any) {
		if (!updated) {
			axios
				.post("/api/user/partner", {donations: e.target.value})
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
			.patch("/api/event/dj-settings", {id: data.id, ...obj})
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
						<UpdateStauts data={data} setData={setData} />
						{data.userHasRightToManage === 1 && (
							<div className="m-4">
								<Link className="p-3 bg-fuchsia-700 hover:bg-fuchsia-800 rounded-lg" href={`/dash/em/event/${data.id}`}>
									Manage Event Data
								</Link>
							</div>
						)}
						<hr className="my-2" />
						<div className="flex flex-col gap-3">
							<div className="flex flex-row mt-1">
								<span className="my-auto mr-auto">Music Suggestions</span>
								<span className="my-auto ms-auto">
									<Switch checked={data.msuggestions === 1} onChange={handleSuggestionsUpdate}></Switch>
								</span>
							</div>

							<div className="flex flex-row mt-1">
								<span className="my-auto mr-auto">Genre Vote</span>
								<span className="my-auto ms-auto">
									<button
										className={"py-1 px-3 rounded-md " + (data.genreVote == 0 ? "bg-fuchsia-500" : "bg-red-500")}
										onClick={handleGenreUpdate}>
										{data.genreVote == 0 ? "Start" : "Stop"}
									</button>
								</span>
							</div>
							<hr className="my-2" />

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
						<hr className="my-2" />
						<h1 className="text-center text-2xl text-white font-mono font-bold">DJ Song Preview</h1>
						<div>
							<MSuggestions djView />
						</div>
					</div>
				)}
			</div>
			<div className="w-full md:w-2/3">
				<LiveEventUpdates genreVoteLive={data.genreVote} evid={params.id} />
			</div>
		</div>
	);
}

export default DjView;
