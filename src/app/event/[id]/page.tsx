"use client";
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
import {IoSettings} from "react-icons/io5";
import {EventReactions} from "@/app/dash/_components/EventView";
import {LoadManContext} from "@/app/LoadManContext";
import {FullEvent} from "@/types";
import UserSelector from "@/app/dash/_components/UserSelector";

function ManageEvent({params}: {params: {id: number}}) {
	const [data, setData] = useState<null | FullEvent>(null);

	const [tliked, setTLiked] = useState(false);
	const [tcoming, setTComing] = useState(false);

	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const {handleAxiosError, handleError} = useContext(AlertContext);

	useEffect(() => {
		addLoadingItem();
		axios
			.get("/api/event/" + params.id)
			.then((response) => {
				if (response.data.id) {
					setData(parseEventForView(response.data));
					setTComing(response.data.coming);
					setTLiked(response.data.liked);
					finishedLoadingItem();
				} else {
					window.location.replace("/");
					handleError("Failed to load event", "error");
				}
			})
			.catch(handleAxiosError);
	}, []);

	function reacted(name: string, value: boolean) {
		if (data)
			axios
				.post("/api/event/reaction", {eventId: data.id, name: name === "like" ? 5 : 4, value: value})
				.then()
				.catch(handleAxiosError);
	}

	return (
		<div>
			{data && (
				<div className="text-center font-mono max-w-lg mx-auto m-4">
					<h1 className="text-center text-2xl text-white font-mono font-bold">{data.name}</h1>
					{data.userHasRightToManage > 0 && (
						<div className="my-1 bg-cyan-900 bg-opacity-70 rounded-lg p-2">
							<div className="flex gap-4 justify-center">
								<UpdateStauts data={data} setData={setData} />

								<Link
									className="my-auto bg-fuchsia-700 hover:bg-fuchsia-800 rounded-full"
									href={`/dash/em/event/${data.id}`}>
									<IoSettings className="m-2 text-2xl" />
								</Link>
							</div>
							{data.privateev && (
								<div className="w-full">
									<hr className="my-2" />
									<h3 className="text-center font-bold">Invite users</h3>
									<UserSelector evid={params.id}/>
								</div>
							)}
						</div>
					)}
					<div className="flex justify-center">
						<StatusPointer status={data.status} lg />
					</div>
					<p className="my-4">{moment(data.dateStart, "YYYY-MM-DDTHH:mm").format("HH:mm DD.MMMM.YYYY")}</p>
					{/* MAYBE ADD TO CALENDAR FEATURE */}
					<h2 className="text-center font-mono text-white text-xl mt-2">Location</h2>
					<LocationXlView data={data.locationData as any}></LocationXlView>
					<div className="mx-auto max-w-xl my-2"></div>
					<DJView djs={data.djs}></DJView>
					<div className="my-2 bg-gray-700 rounded-lg">
						{EventReactions(data.id, reacted, tcoming, setTComing, tliked, setTLiked, data.nrliked, data.nrcoming)}
					</div>
				</div>
			)}
		</div>
	);
}

export default ManageEvent;
