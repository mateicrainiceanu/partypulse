"use client";
import {createContext, ReactNode, useState, useContext, useEffect} from "react";
import {UserContext} from "./UserContext";
import {FullEvent, FullLocation} from "@/types";
import {BsXCircleFill} from "react-icons/bs";
import UserNotifcations from "./UserNotifcations";
import axios from "axios";
import {AlertContext} from "./AlertContext";
import {Button} from "@mui/material";

const UserNotifContext = createContext(null as any);

function UserNotifProvider({children}: {children: ReactNode}) {
	const [show, setShow] = useState(false);

	const {user} = useContext(UserContext);
	const {handleAxiosError} = useContext(AlertContext);

	const [notifications, setNotifications] = useState<IUserNotification[]>([]);

	function showNotif() {
		setShow(true);
	}
	function hideNotif() {
		setShow(false);
	}

	useEffect(() => {
		if (user.id != 0) {
			setInterval(refreshData, 5000);
		}
	}, [user]);

	async function refreshData() {
		axios
			.get("/api/user/notification")
			.then((res) => {
				setNotifications(res.data);
			})
			.catch(handleAxiosError);
	}

	async function updateNotifcationStatus(notid: number, newstatus: number, markAllAsRead?: boolean) {
		axios
			.patch("/api/user/notification", {notid, newstatus, markAllAsRead})
			.then((res) => {
				setNotifications(res.data);
			})
			.catch(handleAxiosError);
	}

	return (
		<>
			<UserNotifContext.Provider value={{show, showNotif, hideNotif, updateNotifcationStatus, notifications}}>
				{show ? (
					<div className="flex w-vw">
						<div className="hidden md:block md:w-1/2 lg:w-2/3">{children}</div>
						<div className="w-full md:block md:w-1/2 lg:w-1/3 p-4 bg-slate-900 overflow-y-scroll h-screen">
							<div className="flex justify-center">
								<h1 className="text-lg text-center font-mono my-2 mx-auto">Notifications</h1>
								<BsXCircleFill className="mr-0 my-auto text-xl" onClick={hideNotif} />
							</div>
							<div className="flex my-auto justify-center">
								<Button
									color="secondary"
									variant="outlined"
									onClick={() => {
										updateNotifcationStatus(0, 0, true);
									}}>
									Mark all as read
								</Button>
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
