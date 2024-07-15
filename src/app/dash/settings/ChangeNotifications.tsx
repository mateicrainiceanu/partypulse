import {AlertContext} from "@/app/AlertContext";
import {UserContext} from "@/app/UserContext";
import {Switch} from "@mui/material";
import axios from "axios";
import {getCookie, setCookie} from "cookies-next";
import React, {useContext, useEffect, useState} from "react";

function ChangeNotifications() {
	const [enabled, setEnabled] = useState(true);

	const {user, setUser} = useContext(UserContext);
	const {handleAxiosError, handleError} = useContext(AlertContext);

	useEffect(() => {
		if (getCookie("emailNotif") == "0") setEnabled(true);
		else setEnabled(false);
	}, []);

	function handleChange(_: any, newVal: boolean) {
		setEnabled(newVal);
		axios
			.get("/api/user/notification/change?enabled=" + newVal)
			.then((_) => {
				handleError("Successfuly changed setting.", "success");
                setCookie("emailNotif", (newVal ? "1" : "0"))
			})
			.catch((err) => {
				setEnabled(!newVal);
				handleAxiosError(err);
			});
	}

	return (
		<div>
			<div className="flex my-2">
				<span className="my-auto">Email notifications</span>
				<Switch className="ms-auto" checked={enabled} onChange={handleChange} />
			</div>
		</div>
	);
}

export default ChangeNotifications;
