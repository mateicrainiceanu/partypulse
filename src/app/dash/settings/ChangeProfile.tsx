import React, {useContext, useEffect, useState} from "react";
import FormElement from "@/components/FormElement";
import FormBtn from "@/components/FormBtn";
import {UserContext} from "@/app/UserContext";
import axios from "axios";
import {LoadingContext} from "@/app/LoadingContext";
import {AlertContext} from "@/app/AlertContext";

function ChangeProfile() {
	const {user, setUser, getUserData} = useContext(UserContext);
	const [data, setData] = useState({uname: "", donations: ""});
	const [avalabile, setAvalabile] = useState(false);
	const setLoading = useContext(LoadingContext);
	const {handleAxiosError} = useContext(AlertContext);

	useEffect(() => {
		if (user.id != 0) {
			setData(user);
		}
	}, [user]);

	async function handleChange(e: any) {
		setData((prevData: any) => ({...prevData, [e.target.name]: e.target.value}));

		await axios
			.post("/api/username-check", {username: e.target.value})
			.then((response) => {
				setAvalabile(true);
			})
			.catch((error) => {
				handleAxiosError(error);
			});
	}

	async function handleSumbit(e: any) {
		setLoading(true);
		await axios
			.post("/api/partner", {username: data.uname, donations: data.donations})
			.then((data) => {
				alert("ok");
				setUser(data.data);
			})
			.catch((error) => {
				handleAxiosError(error);
			});

		setLoading(false);
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
