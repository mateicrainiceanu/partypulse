import React, {useContext} from "react";
import axios from "axios";
import {LoadingContext} from "@/app/LoadingContext";
import {parseEventForView} from "@/app/dash/_lib/data-manager";

function UpdateStauts({data, setData}: {data: any; setData: any}) {
	const setLoading = useContext(LoadingContext);
	function handleStatusChange(e: any) {
		var stat: Number;
		if (e.target.id == "1") {
			stat = data.status != 1 ? 1 : 2;
		} else {
			stat = 0;
		}

		axios
			.patch("/api/event/" + data.id + "/status", {status: stat})
			.then((response) => {
				setData(parseEventForView(response.data));
				setLoading(false);
			})
			.catch((err) => {
				alert("There was an error");
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
