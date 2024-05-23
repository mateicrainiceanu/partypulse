import React, {useContext, useEffect, useState} from "react";
import FormElement from "@/app/components/FormElement";
import FormBtn from "@/app/components/FormBtn";
import {UserContext} from "@/app/UserContext";
import axios from "axios";
import {LoadingContext} from "@/app/LoadingContext";
import {AlertContext} from "@/app/AlertContext";
import { LoadManContext } from "@/app/LoadManContext";

function ChangeProfile() {
	const {user, setUser, getUserData} = useContext(UserContext);
	const [data, setData] = useState({uname: "", donations: ""});
	const [avalabile, setAvalabile] = useState(false);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const {handleAxiosError, handleError} = useContext(AlertContext);

	useEffect(() => {
		if (user.id != 0) {
			setData(user);
		}
	}, [user]);

	async function handleChange(e: any) {
		setData((prevData: any) => ({...prevData, [e.target.name]: e.target.value}));

		await axios
			.post("/api/user/username-check", {username: e.target.value})
			.then((response) => {
				setAvalabile(true);
			})
			.catch((error) => {
				handleAxiosError(error);
			});
	}

	async function handleSumbit(e: any) {
		addLoadingItem();
		await axios
			.post("/api/user/partner", {username: data.uname, donations: data.donations})
			.then((data) => {
				handleError("Data was upadated.", "success");
				setUser(data.data);
				finishedLoadingItem()
			})
			.catch(handleAxiosError);
	}

	return (
		<div>
			<FormElement
				label="Username"
				name="uname"
				type="text"
				value={data.uname}
				handleChange={handleChange}></FormElement>
			{user.uname !== data.uname && <p className="text-center">Avalabile: {avalabile ? "YES" : "NO"}</p>}
			<FormElement
				label="Donations Page URL"
				name="donations"
				type="text"
				value={data.donations}
				handleChange={handleChange}></FormElement>
			<FormBtn onClick={handleSumbit} name="Update"></FormBtn>
		</div>
	);
}

export default ChangeProfile;
