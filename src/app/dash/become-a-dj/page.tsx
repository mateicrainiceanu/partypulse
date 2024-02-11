"use client";
import {UserContext} from "@/app/UserContext";
import React, {useContext, useState} from "react";
import FormElement from "@/components/FormElement";
import FormBtn from "@/components/FormBtn";
import axios from "axios";

function BecomeDJ() {
	const {user} = useContext(UserContext);
	const [username, setUsername] = useState("");
	const [avalabile, setAvalabile] = useState(false);

	async function handleChange(e: any) {
        const newuname = e.target!.value.replaceAll(" ", "");
		setUsername(newuname);

		await axios
			.post("/api/username-check", {username: "dj_" + newuname})
			.then((response) => {
				setAvalabile(true);
			})
			.catch((error) => {
				setAvalabile(false);
			});
	}

	async function handleSubmit() {
        if (!avalabile) {
            alert("username not avalabile")
            return
        }

		await axios
			.post("/api/partner", {username: "dj_" + username, ptype: 2})
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
