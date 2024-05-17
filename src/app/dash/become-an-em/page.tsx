"use client";

import React from "react";
import {useContext} from "react";
import {UserContext} from "@/app/UserContext";
import FormBtn from "@/app/components/FormBtn";
import axios from "axios";
import {LoadingContext} from "@/app/LoadingContext";
import {AlertContext} from "@/app/AlertContext";

function BecomeAnEm() {
	const {user} = useContext(UserContext);
	const setLoading = useContext(LoadingContext);
	const {handleAxiosError} = useContext(AlertContext);

	async function handleSubmit() {
		setLoading(true);
		await axios
			.post("/api/user/partner", {ptype: 1})
			.then((data) => {
				//implementation of ok
				window.location.replace("/dash");
				alert("ok");
			})
			.catch((error) => {
				handleAxiosError(error);
			});
	}

	return (
		<div>
			<div className="items-center mx-auto flex-col justify-center p-10 max-w-xl text-center">
				<h2>You are currently connected with:</h2>
				<h3 className="font-bold font-mono py-2">{user.email}</h3>

				<FormBtn onClick={handleSubmit} name="Become an Event Manager"></FormBtn>
			</div>
		</div>
	);
}

export default BecomeAnEm;
