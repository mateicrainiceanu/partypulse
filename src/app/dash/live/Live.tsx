import React, {useContext, useEffect, useState} from "react";
import ConfirmAttendance from "./LiveComponents/ConfirmAttendance";
import axios from "axios";
import LiveView from "./LiveComponents/LiveView";
import FormBtn from "@/app/components/FormBtn";
import {AlertContext} from "@/app/AlertContext";
import {FullEvent} from "@/types";
import {LoadManContext} from "@/app/LoadManContext";
import EventView from "../_components/EventView";

function Live() {
	const [found, setFound] = useState(null);
	const [tried, setTried] = useState(false);
	const [event, setEvent] = useState<null | FullEvent>(null);
	const {handleAxiosError} = useContext(AlertContext);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);

	useEffect(() => {
		setTimeout(
			() => {
				getData();
			},
			tried ? 5000 : 0
		);
	}, [event]);

	function getData() {
		if (!tried) addLoadingItem();
		axios
			.get("/api/user/event")
			.then((res) => {
				setEvent(res.data.event);
				setFound(res.data.found);
				if (!tried) finishedLoadingItem();
				setTried(true);
			})
			.catch(handleAxiosError);
	}

	return (
		<div>
			{found && event ? (
				<div>
					{event.status != 1 && (
						<div className="max-w-lg mx-auto p-2 md:p-0">
							<EventView evdata={event} />
						</div>
					)}
					{event.status == 0 && (
						<div className="my-20 text-center font-mono max-w-lg mx-auto p-5">
							<h1 className="text-3xl font-bold my-2">Event has not started</h1>
							<p>
								The EM or the DJ have not started the event yet. If you think this is a mistake on their side, try and
								explain the problem to the stuff. People make mistakes!
							</p>
							<p>Try and refresh to see of the problem is solved!</p>

							<FormBtn name="refresh" onClick={getData}></FormBtn>
						</div>
					)}
					{event.status == 1 && (
						<div>
							<LiveView event={event} setEvent={setEvent as (event: FullEvent) => void} />
						</div>
					)}
					{event.status == 2 && (
						<div className="my-20 text-center font-mono max-w-lg mx-auto p-5">
							<h1 className="text-3xl font-bold my-2">Event is over</h1>
							<p>
								The DJ or EM has ended the event. If you think this is a mistake on their side, try and explain the
								problem to the stuff. People make mistakes!
							</p>
							<p>Try and refresh to see of the problem is solved!</p>

							<FormBtn name="refresh" onClick={getData}></FormBtn>
						</div>
					)}
				</div>
			) : (
				<ConfirmAttendance></ConfirmAttendance>
			)}
		</div>
	);
}

export default Live;
