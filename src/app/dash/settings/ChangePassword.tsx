"use client"
import React, {MouseEventHandler, useState} from "react";
import FormElement from "@/components/FormElement";
import FormBtn from "@/components/FormBtn";

export function ChangePassword() {
	const [passwordData, setPasswordData] = useState({oldPassword: "", newPassword: "", checkPssw: ""});

	function handleChange(e: any) {
		setPasswordData((prevData) => ({...prevData, [e.target.name]: e.target.value}));
	}

	function handleSubmit(e: any) {
		//handle ChangePssw Logic
    if (passwordData.newPassword === passwordData.checkPssw){

    } else {
      alert("Passwords must match")
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
				value={passwordData.oldPassword}
				handleChange={handleChange}></FormElement>
			<FormBtn onClick={handleSubmit} name="Change"></FormBtn>
		</>
	);
}
