"use client";
import {LoadingContext} from "@/app/LoadingContext";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import {getCookie, deleteCookie} from "cookies-next";
import {AlertContext} from "@/app/AlertContext";
import {LoadManContext} from "@/app/LoadManContext";

function VerifyCodeInParams({params}: {params: {code: string}}) {
	const {addLoadingItem} = useContext(LoadManContext);
	const {handleError, handleAxiosError} = useContext(AlertContext);
	useEffect(() => {
		addLoadingItem();
		const code = params.code;
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
	}, []);

	return <div></div>;
}

export default VerifyCodeInParams;
