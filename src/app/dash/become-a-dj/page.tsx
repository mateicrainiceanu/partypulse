"use client";
import {UserContext} from "@/app/UserContext";
import React, {useContext, useState} from "react";
import FormElement from "@/app/components/FormElement";
import FormBtn from "@/app/components/FormBtn";
import axios from "axios";
import {LoadingContext} from "@/app/LoadingContext";
import {AlertContext} from "@/app/AlertContext";
import { LoadManContext } from "@/app/LoadManContext";

function BecomeDJ() {
	const {user} = useContext(UserContext);
	const [username, setUsername] = useState("");
	const [avalabile, setAvalabile] = useState(false);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const {handleAxiosError, handleError} = useContext(AlertContext);

	async function handleChange(e: any) {
		const newuname = e.target!.value.replaceAll(" ", "");
		setUsername(newuname);

		await axios
			.post("/api/user/username-check", {username: "dj_" + newuname})
			.then((response) => {
				setAvalabile(true);
			})
			.catch((error) => {
				handleAxiosError(error);
				setAvalabile(false);
			});
	}

	async function handleSubmit() {
		if (!avalabile) {
			alert("username not avalabile");
			return;
		}
		addLoadingItem();

		await axios
			.post("/api/user/partner", {username: "dj_" + username, ptype: 2})
			.then(() => {
				window.location.replace("/dash");
				handleError("Updated data", "success");
			})
			.catch(handleAxiosError);
	}

	return (
		<div>
			<div className="items-center mx-auto flex-col justify-center p-10 max-w-xl text-center">
				<h2>You are currently connected with:</h2>
				<h3 className="font-bold font-mono py-2">{user.email}</h3>
				<FormElement
					handleChange={handleChange}
					type="text"
					name="username"
					value={username}
					label={"New Username: dj_" + username}></FormElement>

				<p>Avalabile: {avalabile ? "YES" : "NO"}</p>
				<FormBtn onClick={handleSubmit} name="Become a DJ"></FormBtn>
			</div>
		</div>
	);
}

export default BecomeDJ;
