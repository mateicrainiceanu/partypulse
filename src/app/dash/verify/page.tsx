"use client";

import {UserContext} from "@/app/UserContext";
import React, {useContext, useEffect, useState} from "react";
import FormElement from "@/app/components/FormElement";
import FormBtn from "@/app/components/FormBtn";
import axios from "axios";
import {AlertContext} from "@/app/AlertContext";
import {getCookie, deleteCookie} from "cookies-next";

function VerifyUser() {
	const {user} = useContext(UserContext);
	const {handleAxiosError, handleError} = useContext(AlertContext);
	const [code, setCode] = useState("");
	const [resend, setResend] = useState(false);
	const [time, setTime] = useState(20);
	let intervalSet = false;

	useEffect(() => {
		waitToResend();
		if (!intervalSet) {
			setInterval(() => {
				setTime((time) => time - 1);
			}, 1000);
			intervalSet = true;
		}
	}, []);

	function updateCode() {
		axios
			.get("/api/user/verify/update-code")
			.then((_) => {
				handleError("Email was resent!", "success");
			})
			.catch(handleAxiosError);
	}

	function handleSubmit() {
		axios
			.post("/api/user/verify", {code})
			.then((res) => {
				handleError(res.data, "success");
				if (getCookie("prevUrl") != undefined && getCookie("prevUrl") != "")
					window.location.replace(getCookie("prevUrl") || "/");
				else window.location.replace("/dash");
				deleteCookie("prevUrl");
			})
			.catch(handleAxiosError);
	}

	async function waitToResend() {
		setTimeout(() => {
			setResend(true);
		}, 20000);
	}

	return (
		<div className="max-w-lg mx-auto">
			<h1 className="text-center text-xl font-mono">Verify your account</h1>
			<p className="my-2">
				We have sent you an email at: <span className="font-bold">{user.email}</span>. Please check your email,
				including your spam an fill in the code below.
			</p>
			<FormElement
				name="code"
				value={code}
				label="Code"
				handleChange={(e: any) => {
					setCode(e.target.value);
				}}></FormElement>
			<FormBtn name="Verify account" onClick={handleSubmit} />

			<button
				className={"w-full text-center p-1 rounded-lg " + (resend ? "bg-gray-800 hover:bg-gray-900" : "bg-gray-500")}
				disabled={!resend}
				onClick={updateCode}>
				Resend code {!resend && " in " + time}
			</button>
		</div>
	);
}

export default VerifyUser;
