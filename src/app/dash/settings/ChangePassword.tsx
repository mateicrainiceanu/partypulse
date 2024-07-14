"use client";
import React, {MouseEventHandler, useContext, useState} from "react";
import FormElement from "@/app/components/FormElement";
import FormBtn from "@/app/components/FormBtn";
import axios from "axios";
import {AlertContext} from "@/app/AlertContext";
import MyPassChecker, {checkPassword} from "@/app/register/MyPassChecker";

export function ChangePassword({code}: {code?: string}) {
	const [passwordData, setPasswordData] = useState({oldPassword: "", newPassword: "", checkPssw: ""});
	const {handleAxiosError, handleError, dialogToUser} = useContext(AlertContext);

	function handleChange(e: any) {
		setPasswordData((prevData) => ({...prevData, [e.target.name]: e.target.value}));
	}

	async function handleSubmit(e: any) {
		if (checkPassword(passwordData.newPassword).id < 1) {
			dialogToUser({
				title: "Password is to weak!",
				content:
					"In order to ensure our users safety, the passwords used on our platform should be at least at a medium safety-level. That means that the password should contain at least 8 uppercase and lowercase letters and symbols. If you struggle with password management, there always is the option to sing in with Google or Spotify.",
			});
			return;
		}

		//handle ChangePssw Logic
		if (passwordData.newPassword === passwordData.checkPssw) {
			await axios
				.post("/api/user/change-ps", {
					oldPassword: passwordData.oldPassword,
					code: code,
					newPassword: passwordData.newPassword,
				})
				.then((data) => {
					window.location.replace('/dash')
					handleError("Succesfully changed password!", 'success')
					setPasswordData({oldPassword: "", newPassword: "", checkPssw: ""});
				})
				.catch(handleAxiosError);
		} else {
			alert("Passwords must match");
		}
	}

	return (
		<>
			<h2 className="text-xl text-center mt-2 mb-1 font-mono text-violet-300">Change password</h2>
			{!code && (
				<FormElement
					type="password"
					name="oldPassword"
					label="Old Password"
					value={passwordData.oldPassword}
					handleChange={handleChange}></FormElement>
			)}
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
			<MyPassChecker givenPass={passwordData.newPassword}/>
			<FormBtn onClick={handleSubmit} name="Change"></FormBtn>
		</>
	);
}
