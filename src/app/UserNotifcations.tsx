import React from "react";
import {IUserNotification} from "./UserNotifContext";
import UserNotification from "./components/UserNotification";

function UserNotifcations({n}: {n: IUserNotification[]}) {
	return (
		<div className="pb-24">
			{n
				.sort((n1, n2) => n1.status - n2.status)
				.map((n) => (
					<UserNotification key={n.id} n={n} />
				))}
		</div>
	);
}

export default UserNotifcations;
