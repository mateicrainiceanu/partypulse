import React, {useContext, useEffect, useState} from "react";
import {IUserNotification, UserNotifContext} from "../UserNotifContext";
import {UserXsView} from "../dash/_components/UserSmView";
import {TbDotsCircleHorizontal} from "react-icons/tb";
import {FaCheckCircle} from "react-icons/fa";

function UserNotification({n}: {n: IUserNotification}) {
	const [status, setStatus] = useState(n.status);
	const {updateNotifcationStatus} = useContext(UserNotifContext);

	useEffect(() => {
		setStatus(n.status);
	}, [n.status]);

	function updateStatus() {
		setStatus((prev) => {
			const newStatus = prev == 0 ? 1 : 0;
			updateNotifcationStatus(n.id, newStatus);
			return newStatus;
		});
	}

	return (
		<div className="m-2">
			<div className="bg-gray-800 rounded-lg p-2">
				<p className="flex gap-1">
					<UserXsView uname={n.from.uname} role={n.from.role} mono /> {n.text}
					<div className="ms-auto flex gap-2">
						<TbDotsCircleHorizontal className="text-2xl my-auto" />

						<FaCheckCircle
							onClick={updateStatus}
							className={"text-xl my-auto text-gray-200 " + (status == 0 ? "text-gray-200" : "text-green-400")}
						/>
					</div>
				</p>
			</div>
		</div>
	);
}

export default UserNotification;
