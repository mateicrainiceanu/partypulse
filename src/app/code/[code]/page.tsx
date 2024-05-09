"use client";
import { AlertContext } from "@/app/AlertContext";
import {LoadingContext} from "@/app/LoadingContext";
import axios from "axios";
import React, {useContext, useEffect} from "react";

function QRCodeConfim({params}: {params: {code: string}}) {
	const setLoading = useContext(LoadingContext);
	const {handleAxiosError} = useContext(AlertContext)

	useEffect(() => {
		setLoading(true);
		axios
			.post("/api/code/verify", {code: params.code})
			.then((res) => {
				if (res.data.found == false) {
					setLoading(false);
				} else {
					localStorage.setItem("view", "live");
					window.location.replace("/dash");
				}
			})
			.catch((err) => {
				handleAxiosError(err)
			});
	}, []);

	return (
		<div>
			<div className="max-w-lg mx-auto my-3">
				<h1 className="text-center text-lg font-mono">Invalid Code</h1>
			</div>
		</div>
	);
}

export default QRCodeConfim;
