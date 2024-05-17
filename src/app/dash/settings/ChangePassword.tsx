"use client";
import React, {MouseEventHandler, useContext, useState} from "react";
import FormElement from "@/app/components/FormElement";
import FormBtn from "@/app/components/FormBtn";
import axios from "axios";
import {AlertContext} from "@/app/AlertContext";

export function ChangePassword() {
	const [passwordData, setPasswordData] = useState({oldPassword: "", newPassword: "", checkPssw: ""});
	const {handleAxiosError} = useContext(AlertContext);

	function handleChange(e: any) {
		setPasswordData((prevData) => ({...prevData, [e.target.name]: e.target.value}));
	}

	async function handleSubmit(e: any) {
		//handle ChangePssw Logic
		if (passwordData.newPassword === passwordData.checkPssw) {
			await axios
				.post("/api/change-ps", {newPassword: passwordData.newPassword})
				.then((data) => {
					alert("OK");
					setPasswordData({oldPassword: "", newPassword: "", checkPssw: ""});
				})
				.catch((error) => {
					handleAxiosError;
				});
		} else {
			alert("Passwords must match");
		}
	}

	return (
		<>
			<h2 className="text-xl text-center mt-2 mb-1 font-mono text-violet-300">Change password</h2>
			<FormElement
				type="password"
				name="oldPassword"
				label="Old Password"
				value={passwordData.oldPassword}
				handleChange={handleChange}></FormElement>
			<FormElement
				type="password"
				name="newPassword"
				label="New Password"
				value={passwordData.newPassword}
				handleChange={handleChange}></FormElement>
			<FormElement
				type="password"
				name="checkPssw"
				label="Check Password"
				value={passwordData.checkPssw}
				handleChange={handleChange}></FormElement>
			<FormBtn onClick={handleSubmit} name="Change"></FormBtn>
		</>
	);
}
