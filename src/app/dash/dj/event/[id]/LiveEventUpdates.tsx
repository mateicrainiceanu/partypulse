"use client";

import React from "react";
import {useWebSocket} from "next-ws/client";
import {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import SongPreview, {Song} from "@/components/SongPreview";
import {IoPlayForwardCircleSharp, IoPlayCircle} from "react-icons/io5";
import {GoXCircleFill} from "react-icons/go";
import {RiSortAsc, RiSortDesc} from "react-icons/ri";

interface SongRequest {
	id: number;
	status: number;
	song: Song;
}

function LiveEventUpdates({evid}: {evid: number}) {
	const ws = useWebSocket();
	let unmounts = 0;
	//    ^? WebSocket on the client, null on the server
	const [data, setData] = useState([]);
	const [djMiniView, setDjMiniView] = useState("all");
	const [order, setOrder] = useState(1);

	async function handleMsg(event: MessageEvent<Blob>) {
		setData(await JSON.parse(await event.data.text()));
	}

	useEffect(() => {
		ws?.addEventListener("message", handleMsg);
		(ws as any).onopen = () => {
			(ws as any).send(JSON.stringify({token: getCookie("token"), evId: evid}));
		};
		return () => {
			if (unmounts == 1) {
				console.log("Component did unmount");
				ws?.close();
			} else {
				unmounts++;
			}
		};
		//eslint-disable-next-line
	}, []);

	function handleViewChange(event: any) {
		setDjMiniView(event.target.id);
	}

	function handleStatusChange(reqId: number, newStatus: number) {		
		ws?.send(JSON.stringify({reqId: reqId, newStatus: newStatus}));
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

	return (
		<div className="w-full p-3">
			<div className="bg-gray-800 rounded-lg">
				<div className="w-full p-3">
					<h2 className="text-xl font-mono font-bold text-center">Requests</h2>
					<p className="text-xs my-2 italic text-gray-400">
						Disclaimer: none of the buttons play one song. They just have an impanct on your view.
					</p>
				</div>
				<div className="mt-2">
					<div className="mx-2 flex gap-3 flex-wrap">
						<button
							className={
								"rounded-t-lg py-2 px-3 text-black " +
								(djMiniView == "all" ? "bg-lime-800 text-white" : "bg-fuchsia-300")
							}
							onClick={handleViewChange}
							id="all">
							All
						</button>
						<button
							className={
								"rounded-t-lg py-2 px-3 text-black " + (djMiniView == "live" ? "bg-lime-800 text-white" : "bg-lime-300")
							}
							onClick={handleViewChange}
							id="live">
							Live Requests
						</button>
						<button
							className={
								"rounded-t-lg py-2 px-3 text-black " +
								(djMiniView == "queued" ? "bg-lime-800 text-white" : "bg-yellow-300")
							}
							onClick={handleViewChange}
							id="queued">
							Queued
						</button>
						<button
							className={
								"rounded-t-lg py-2 px-3 text-black " +
								(djMiniView == "canceled" ? "bg-lime-800 text-white" : "bg-red-400")
							}
							onClick={handleViewChange}
							id="canceled">
							Canceled
						</button>
						<button
							className={
								"rounded-t-lg py-2 px-3 text-black " +
								(djMiniView == "played" ? "bg-lime-800 text-white" : "bg-blue-400")
							}
							onClick={handleViewChange}
							id="played">
							Played
						</button>
						<div
							className="text-2xl ms-auto my-auto mx-2 flex"
							onClick={() => {
								setOrder((prev) => prev * -1);
							}}>
							<p className="text-xs my-2 italic text-gray-400 my-auto mx-2 select-none">
								{order < 0 ? "Newest" : "Oldest"}
							</p>
							{order == 1 ? <RiSortAsc /> : <RiSortDesc />}
						</div>
					</div>
				</div>
				<div className="py-3 rounded-b-lg px-1 bg-lime-800">
					{data
						.filter((sr: SongRequest) => (getFilter() != "" ? sr.status == Number(getFilter()) : true))
						.sort((sr1: SongRequest, sr2: SongRequest) => (sr1.id - sr2.id) * order)
						.map((sr: SongRequest) => (
							<div key={sr.id} className="flex flex-row hover:bg-lime-700 px-4 rounded-lg">
								<div className="my-auto text-3xl flex gap-3">
									<IoPlayCircle
										className="hover:text-green-500"
										onClick={() => {
											handleStatusChange(sr.id, 3);
										}}
									/>
									<IoPlayForwardCircleSharp
										className="hover:text-yellow-400"
										onClick={() => {
											handleStatusChange(sr.id, 1);
										}}
									/>
									<GoXCircleFill
										className="hover:text-red-500 text-2xl my-auto"
										onClick={() => {
											handleStatusChange(sr.id, 2);
										}}
									/>
								</div>
								<SongPreview songData={sr.song} djView></SongPreview>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

export default LiveEventUpdates;
