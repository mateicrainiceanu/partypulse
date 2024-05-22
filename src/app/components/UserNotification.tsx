import React, {useContext, useEffect, useState} from "react";
import {IUserNotification, UserNotifContext} from "../UserNotifContext";
import UserSmView, {UserXsView} from "../dash/_components/UserSmView";
import {TbDotsCircleHorizontal} from "react-icons/tb";
import {FaCheckCircle} from "react-icons/fa";
import LocationSmView from "../dash/_components/LocationSmView";
import EventView from "../dash/_components/EventView";
import {parseEventForView} from "../dash/_lib/data-manager";
import {BsXCircleFill} from "react-icons/bs";
import moment from "moment";

function UserNotification({n}: {n: IUserNotification}) {
	const [status, setStatus] = useState(n.status);
	const {updateNotifcationStatus} = useContext(UserNotifContext);
	const [expanded, setExpanded] = useState(false);

	let ev;

	if (n.event) {
		ev = parseEventForView(n.event);
	}

	useEffect(() => {
		setStatus(n.status);
	}, [n.status]);

	function updateStatus(e: any) {
		e.stopPropagation();
		setStatus((prev) => {
			const newStatus = prev == 0 ? 1 : 0;
			updateNotifcationStatus(n.id, newStatus);
			return newStatus;
		});
	}

	function handleExpand(e: any) {
		e.stopPropagation();
		setExpanded((prev) => !prev);
	}

	return (
		<div className="m-2">
			<div className={"rounded-lg p-2 " + (status == 1 ? "bg-gray-800" : "bg-gray-700")}>
				<div
					onClick={(e: any) => {
						e.stopPropagation();
						setExpanded(true);
					}}>
					<div className="flex gap-1">
						<UserXsView uname={n.from.uname} role={n.from.role} mono /> {n.text}
						<div className="ms-auto flex gap-2">
							{expanded ? (
								<BsXCircleFill className="text-xl my-auto" onClick={handleExpand} />
							) : (
								<TbDotsCircleHorizontal className="text-2xl my-auto" onClick={handleExpand} />
							)}

							<FaCheckCircle
								onClick={updateStatus}
								className={"text-xl my-auto " + (status == 0 ? "text-gray-200" : "text-green-400")}
							/>
						</div>
					</div>
				</div>

				{expanded && (
					<div>
						<div className="w-full flex justify-end">
							<span className="my-2 font-mono">
								{moment(n.dateTime, "YYYY-MM-DDTHH:mm").format("HH:mm DD.MM.YYYY")}
							</span>
						</div>
						<div className="rounded-lg bg-fuchsia-800 my-2">
							<UserSmView uname={n.from.uname} role={n.from.role} rounded />
						</div>
						{n.itemType == "location" && n.location && (
							<LocationSmView locationData={n.location} showManage={n.location.userHasRightToManage} />
						)}
						{n.itemType == "event" && n.event && (
							<EventView
								id={ev.id}
								name={ev.name}
								date={ev.dateStart}
								location={ev.location}
								djs={ev.djs}
								showManage={ev.userHasRightToManage > 0}
								status={ev.status}
								there={ev.there}
								coming={ev.coming}
								liked={ev.liked}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default UserNotification;
