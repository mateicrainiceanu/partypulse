import React, {useEffect, useState} from "react";
import ConfirmAttendance from "./LiveComponents/ConfirmAttendance";
import axios from "axios";
import LiveView from "./LiveComponents/LiveView";

function Live() {
	const [found, setFound] = useState(null);
	const [event, setEvent] = useState({
		id: 0,
		name: "",
		location: "",
		dateStart: "",
		djs: [],
		status: 0,
		there: false,
		coming: false,
		liked: false,
		userHasRightToManage: 0,
		msuggestions: 0,
		genreVote: 0,
	});

	useEffect(() => {
		axios
			.get("/api/user/event")
			.then((res) => {
				setEvent(res.data.event);
				setFound(res.data.found);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<div>
			{found ? (
				<div>
					<LiveView event={event} />
				</div>
			) : (
				<ConfirmAttendance></ConfirmAttendance>
			)}
		</div>
	);
}

export default Live;
