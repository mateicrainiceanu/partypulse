import React, {useContext} from "react";
import axios from "axios";
import {LoadingContext} from "@/app/LoadingContext";
import {parseEventForView} from "@/app/dash/_lib/data-manager";
import {AlertContext} from "@/app/AlertContext";
import StatusPointer from "@/app/components/StatusPointer";
import {FaPlayCircle, FaRegStopCircle} from "react-icons/fa";
import {GrPowerReset} from "react-icons/gr";
import { LoadManContext } from "@/app/LoadManContext";

function UpdateStauts({data, setData}: {data: any; setData: any}) {
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const {handleAxiosError, dialogToUser} = useContext(AlertContext);

	function handleStatusChange(e: any, force?: boolean, endAssoc?: boolean) {
		addLoadingItem()
		var stat: Number;
		if (e.target.id == "1") {
			stat = data.status != 1 ? 1 : 2;
		} else {
			stat = 0;
		}

		axios
			.patch("/api/event/" + data.id + "/status", {status: stat, confirmedClose: force, endAssoc: endAssoc})
			.then((response) => {
				setData((prev: any) => ({...prev, ...parseEventForView(response.data)}));
				finishedLoadingItem()
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
							{
								btnName: "End association",
								func: () => {
									handleStatusChange(e, false, true);
								},
							},
						],
					});
					finishedLoadingItem()
				} else handleAxiosError(err);
			});
	}
	return (
		<div>
			<div className="max-w-lg mx-auto w-full flex justify-center my-1 gap-2">
				<div className="my-auto">
					<StatusPointer status={data.status} lg />
				</div>
				<button
					id={"1"}
					className={
						"p-2 rounded-full m-1 text-2xl " +
						(data.status != 1 ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600 ")
					}
					onClick={handleStatusChange}>
					{data.status == 1 ? <FaRegStopCircle id={"1"} /> : <FaPlayCircle id={"1"} />}
				</button>
				<button
					id="2"
					className=" p-2 text-2xl rounded-full m-1 bg-gray-500 hover:bg-gray-600"
					onClick={handleStatusChange}>
					<GrPowerReset />
				</button>
			</div>
		</div>
	);
}

export default UpdateStauts;
