"use client";

import React from "react";
import {useContext} from "react";
import {UserContext} from "@/app/UserContext";
import FormBtn from "@/components/FormBtn";
import axios from "axios";

function BecomeAnEm() {
	const {user} = useContext(UserContext);

	async function handleSubmit() {
		await axios
			.post("/api/partner", {ptype: 1})
			.then((data) => {
				//implementation of ok
				window.location.replace("/dash");
				alert("ok");
			})
			.catch((error) => {
				alert("there was an error: " + error);
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
