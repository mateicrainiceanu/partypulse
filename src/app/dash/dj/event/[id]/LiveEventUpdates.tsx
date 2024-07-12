"use client";

import React, {useContext} from "react";
import {useEffect, useState} from "react";
import SongPreview, {Song} from "@/app/components/SongPreview";
import {GoXCircleFill} from "react-icons/go";
import {RiSortAsc, RiSortDesc} from "react-icons/ri";
import axios from "axios";
import {AlertContext} from "@/app/AlertContext";
import {FaCheckCircle, FaListAlt} from "react-icons/fa";

export interface SongRequest {
	id: number;
	title: String;
	artists: string;
	imgsrc: string;
	preview: string;
	requests: Array<string>;
	status: number;
}

function LiveEventUpdates({evid, genreVoteLive}: {evid: number; genreVoteLive: number}) {
	const [data, setData] = useState([]);
	const [votes, setVotes] = useState([]);
	const [renderd, setRenderd] = useState(false);
	const [djMiniView, setDjMiniView] = useState("live");
	const [order, setOrder] = useState(1);
	const {handleAxiosError} = useContext(AlertContext);

	useEffect(() => {
		updateData();
		//eslint-disable-next-line
	}, [data]);

	function updateData() {
		setTimeout(
			() => {
				axios
					.get("/api/event/live?evId=" + evid)
					.then((res) => {
						setRenderd(true);
						setData(res.data.suggestions);
						setVotes(res.data.votes);
					})
					.catch(handleAxiosError);
			},
			renderd ? 5000 : 0
		);
	}

	function handleViewChange(event: any) {
		setDjMiniView(event.target.id);
	}

	function handleStatusChange(reqId: number, newStatus: number) {
		axios
			.patch("/api/event/live", {reqId, newStatus, evid})
			.then((res) => {
				setData(res.data);
			})
			.catch(handleAxiosError);
	}

	function getFilter() {
		var filter: string = "";

		switch (djMiniView) {
			case "all":
				break;
			case "live":
				filter = "0";
				break;
			case "queued":
				filter = "1";
				break;
			case "canceled":
				filter = "2";
				break;
			case "played":
				filter = "3";
				break;

			default:
				break;
		}
		return filter;
	}

	let viewOptions = [
		{
			title: "all",
			color: "bg-gray-200",
		},
		{
			title: "live",
			color: "bg-green-200",
		},
		{
			title: "qued",
			color: "bg-yellow-200",
		},
		{
			title: "canceld",
			color: "bg-red-200",
		},
		{
			title: "played",
			color: "bg-blue-200",
		},
	];

	return (
		<div className="w-full p-3">
			{genreVoteLive == 1 && (
				<div className="mb-3 p-3 rounded-lg bg-gray-900">
					<h2 className="text-xl font-mono font-bold text-center">Genre Vote Results:</h2>
					<hr className="my-2" />

					<p className="text-center">Top 3 Votes:</p>

					<ol className="list-decimal flex flex-wrap justify-center gap-8">
						{votes
							.sort((b, a) => ((a as any).votes.length - (b as any).votes.length) as any)
							.slice(0, 3)
							.map(({genreName, votes}: {genreName: string; votes: Array<{uname: string}>}, i) => (
								<li className="my-1 bg-gray-500 p-3 rounded-lg" key={i}>
									{genreName} : {votes.length}
								</li>
							))}
					</ol>
				</div>
			)}
			<div className="rounded-lg">
				<div className="w-full p-3">
					<h2 className="text-xl font-mono font-bold text-center">Requests</h2>
				</div>
				<div className="mt-2">
					<div className="mx-2 flex gap-3 flex-wrap">
						{viewOptions.map(({title, color}, i) => (
							<ViewOption
								key={i}
								name={title}
								color={color}
								handleViewChange={handleViewChange}
								djMiniView={djMiniView}
							/>
						))}
						<div
							className="text-2xl ms-auto my-auto mx-2 flex"
							onClick={() => {
								setOrder((prev) => prev * -1);
							}}>
							<p className="text-xs italic text-gray-400 my-auto mx-2 select-none">{order < 0 ? "Newest" : "Oldest"}</p>
							{order == 1 ? <RiSortAsc /> : <RiSortDesc />}
						</div>
					</div>
				</div>
				<div className="py-3 rounded-b-lg px-1 bg-yellow-800 dark:bg-fuchsia-950 bg-opacity-20 ">
					{data
						.filter((sr: SongRequest) => (getFilter() != "" ? sr.status == Number(getFilter()) : true))
						.sort((sr1: SongRequest, sr2: SongRequest) => (sr1.id - sr2.id) * order)
						.map((sr: SongRequest) => (
							<div key={sr.id} className="flex flex-row hover:bg-fuchsia-800 px-4 rounded-lg">
								<div className="my-auto text-2xl flex gap-3">
									<FaCheckCircle
										className={"hover:text-green-500 " + (sr.status == 3 ? "text-green-500" : "")}
										onClick={() => {
											handleStatusChange(sr.id, 3);
										}}
									/>
									<FaListAlt
										className={"hover:text-yellow-500 " + (sr.status == 1 ? "text-yellow-500" : "")}
										onClick={() => {
											handleStatusChange(sr.id, 1);
										}}
									/>
									<GoXCircleFill
										className={"hover:text-red-500 text-2xl my-auto " + (sr.status == 2 ? "text-red-500" : "")}
										onClick={() => {
											handleStatusChange(sr.id, 2);
										}}
									/>
								</div>

								<SongPreview songData={sr} djView></SongPreview>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

function ViewOption({
	djMiniView,
	handleViewChange,
	name,
	color,
}: {
	djMiniView: string;
	handleViewChange: (e: any) => void;
	name: string;
	color: string;
}) {
	
	return (
		<button
			className={
				"rounded-t-lg py-2 px-3 text-black " +
				(djMiniView == name ? "bg-yellow-800 bg-opacity-20 dark:bg-fuchsia-950 text-white" : color)
			}
			onClick={handleViewChange}
			id={name}>
			{name[0].toLocaleUpperCase() + name.substring(1)}
		</button>
	);
}

export default LiveEventUpdates;
