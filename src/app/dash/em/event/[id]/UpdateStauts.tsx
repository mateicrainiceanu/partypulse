import React, {useContext} from "react";
import axios from "axios";
import {LoadingContext} from "@/app/LoadingContext";
import {parseEventForView} from "@/app/dash/_lib/data-manager";
import {AlertContext} from "@/app/AlertContext";

function UpdateStauts({data, setData}: {data: any; setData: any}) {
	const setLoading = useContext(LoadingContext);
	const {handleAxiosError, dialogToUser} = useContext(AlertContext);

	function handleStatusChange(e: any, force?: boolean) {
		var stat: Number;
		if (e.target.id == "1") {
			stat = data.status != 1 ? 1 : 2;
		} else {
			stat = 0;
		}

		axios
			.patch("/api/event/" + data.id + "/status", {status: stat, confirmedClose: force})
			.then((response) => {
				setData((prev:any) => ({...prev, ...parseEventForView(response.data)}));
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status === 400) {
					dialogToUser({
						title: err.response.data,
						content:
							"You might have another event in progress that is preventing you to start a new one. You can remove yourself from the other event as em or dj and lose your rights to any changes or start this event by ending the other events.",
						actionButtons: [
							{
								btnName: "End other events",
								func: () => {
									handleStatusChange(e, true);
								},
							},
						],
					});
				} else handleAxiosError(err);
				setLoading(false);
			});
	}
	return (
		<div>
			<div className="max-w-lg mx-auto w-full flex justify-center my-5">
				<button
					id="1"
					className={
						"w-1/3 p-2 rounded-lg mx-1 " +
						(data.status != 1 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600 ")
					}
					onClick={handleStatusChange}>
					{data.status == 1 ? "End" : "Start"} event
				</button>
				<button id="2" className="w-1/3 p-2 rounded-lg mx-1 bg-gray-500 hover:bg-gray-600" onClick={handleStatusChange}>
					Reset Status
				</button>
			</div>
		</div>
	);
}

export default UpdateStauts;
