"use client";
import {AlertContext} from "@/app/AlertContext";
import {LoadingContext} from "@/app/LoadingContext";
import {LoadManContext} from "@/app/LoadManContext";
import axios from "axios";
import React, {useContext, useEffect} from "react";

function QRCodeConfim({params}: {params: {code: string}}) {
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const {handleAxiosError} = useContext(AlertContext);
	useEffect(() => {
		addLoadingItem();
		axios
			.post("/api/code/verify", {code: params.code})
			.then((res) => {
				if (res.data.found == false) {
					finishedLoadingItem();
				} else {
					localStorage.setItem("view", "live");
					window.location.replace("/dash/live");
				}
			})
			.catch(handleAxiosError);
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
