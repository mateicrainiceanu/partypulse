"use client";
import React, {useContext, useState} from "react";
import FormElement from "@/app/components/FormElement";
import FormBtn from "@/app/components/FormBtn";
import {IoCheckmarkCircle} from "react-icons/io5";
import axios from "axios";
import { AlertContext } from "@/app/AlertContext";

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
    const {handleAxiosError, handleError} = useContext(AlertContext)

	function recover() {
        axios.post("/api/user/change-ps/recovery", {email}).then(res => {
            handleError(res.data, 'success')
            setSent(true);
        }).catch(handleAxiosError)
	}

	return (
		<div className="max-w-lg mx-auto my-5">
			<h1 className="text-xl font-bold text-center my-2">Reset your password</h1>
			{!sent ? (
				<div className="my-2">
					<p className="my-2">In order to reset your password, we will send you an email containing a link.</p>
					<FormElement
						name="email"
						type="email"
						label="Your Email"
						handleChange={(e: any) => {
							setEmail(e.target.value);
						}}
						value={email}
					/>
					<FormBtn onClick={recover} name="Send recovery email"></FormBtn>
				</div>
			) : (
				<div className="">
					<p>
						An email containing a reset link was sent to <span className="font-bold">{email}</span>. If this is not your
						email, please click the button below the checkmark.{" "}
					</p>
					<IoCheckmarkCircle className="text-center text-green-400 mx-auto my-10" size={100} />
					<FormBtn
						onClick={() => {
							setSent(false);
						}}
						name="Change email adress"></FormBtn>
				</div>
			)}
		</div>
	);
}

export default ForgotPassword;
