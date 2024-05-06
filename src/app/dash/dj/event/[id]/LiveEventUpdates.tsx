"use client";

import React from "react";
import {useWebSocket} from "next-ws/client";
import {useCallback, useEffect, useRef, useState} from "react";
import {getCookie} from "cookies-next";
import SongPreview, {Song} from "@/components/SongPreview";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsArchiveFill } from "react-icons/bs";


interface SongRequest {
	status: number;
  song: Song
}

function LiveEventUpdates({evid}: {evid: number}) {
	const ws = useWebSocket();
	let unmounts = 0;
	//    ^? WebSocket on the client, null on the server
	const [data, setData] = useState([]);

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
	}, []);

	return (
		<div className="w-full p-3">
			<>
				{data.map((sr: SongRequest, i) => (
					<div key={i} className="flex flex-row hover:bg-gray-800 px-4">
						<div className="my-auto text-2xl flex gap-4">
							<IoCheckmarkCircle />
							<BsArchiveFill/>
						</div>
						<SongPreview songData={sr.song} djView></SongPreview>
					</div>
				))}
			</>
		</div>
	);
}

export default LiveEventUpdates;
