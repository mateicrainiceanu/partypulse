"use client";
import {createContext, ReactNode, useState, useContext, useEffect} from "react";
import {UserContext} from "./UserContext";
import {FullEvent, FullLocation} from "@/types";
import {BsXCircleFill} from "react-icons/bs";
import UserNotifcations from "./UserNotifcations";
import axios from "axios";
import {AlertContext} from "./AlertContext";

const UserNotifContext = createContext(null as any);

function UserNotifProvider({children}: {children: ReactNode}) {
	const [show, setShow] = useState(true);

	const {user} = useContext(UserContext);
	const {handleAxiosError} = useContext(AlertContext);

	const [notifications, setNotifications] = useState<IUserNotification[]>([]);

	function showNotif() {
		setShow(true);
	}

	useEffect(() => {
		if (user.id != 0) {
			axios
				.get("/api/user/notification")
				.then((res) => {
					setNotifications(res.data);
				})
				.catch(handleAxiosError);
		}
	}, [user]);

	async function updateNotifcationStatus(notid: number, newstatus: number) {
		axios
			.patch("/api/user/notification", {notid, newstatus})
			.then((res) => {
				setNotifications(res.data);
			})
			.catch(handleAxiosError);
	}

	return (
		<>
			<UserNotifContext.Provider value={{show, showNotif, updateNotifcationStatus}}>
				{show ? (
					<div className="flex w-vw">
						<div className="w-2/3">{children}</div>
						<div className="w-1/3 p-4 bg-slate-900">
							<div className="flex justify-center">
								<h1 className="text-lg text-center font-mono my-2 mx-auto">Notifications</h1>
								<BsXCircleFill className="ms-auto my-auto text-xl" />
							</div>
							<UserNotifcations n={notifications} />
						</div>
					</div>
				) : (
					children
				)}
			</UserNotifContext.Provider>
		</>
	);
}

export interface IUserNotification {
	id: number;
	status: number;
	dateTime: string;
	forUserId: number;
	fromUserId: number;
	from: {uname: string; role: number};
	nottyp?: string;
	text?: string;
	itemType?: string;
	itemId?: number;
	event?: FullEvent;
	location?: FullLocation;
}

export {UserNotifContext};
export default UserNotifProvider;
