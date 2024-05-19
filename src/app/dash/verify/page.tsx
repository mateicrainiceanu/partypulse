"use client";

import {UserContext} from "@/app/UserContext";
import React, {useContext, useState} from "react";
import FormElement from "@/app/components/FormElement";
import FormBtn from "@/app/components/FormBtn";
import axios from "axios";
import { AlertContext } from "@/app/AlertContext";

function VerifyUser() {
	const {user} = useContext(UserContext);
  const {handleAxiosError, handleError} = useContext(AlertContext)
  const [code, setCode] = useState("")


  function handleSubmit () {
    axios.post("/api/user/verify", {code}).then(res => {
      handleError(res.data, "success")
      window.location.replace("/dash")
    }).catch(handleAxiosError)
  }

	return (
		<div className="max-w-lg mx-auto">
			<h1 className="text-center text-xl font-mono">Verify your account</h1>
			<p className="my-2">
				We have sent you an email at: 
				<span className="font-bold">{user.email}</span>. Please check your email, including your spam an fill in the code below.
			</p>
      <FormElement name="code" value={code} label="Code" handleChange={(e:any) => {
        setCode(e.target.value)
      }}></FormElement>
      <FormBtn name="Verify account" onClick={handleSubmit}/>

      <button className="w-full text-center bg-gray-600 p-1 rounded-lg text-gray-300">Resend code</button>
		</div>
	);
}

export default VerifyUser;
