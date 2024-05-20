"use client";

import React from "react";
import {useContext} from "react";
import {UserContext} from "@/app/UserContext";
import FormBtn from "@/app/components/FormBtn";
import axios from "axios";
import {LoadingContext} from "@/app/LoadingContext";
import {AlertContext} from "@/app/AlertContext";
import {LoadManContext} from "@/app/LoadManContext";

function BecomeAnEm() {
	const {user} = useContext(UserContext);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const {handleAxiosError, handleError} = useContext(AlertContext);

	async function handleSubmit() {
		addLoadingItem();
		await axios
			.post("/api/user/partner", {ptype: 1})
			.then((data) => {
				//implementation of ok
				window.location.replace("/dash");
				handleError("Congratulations!", "success");
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
