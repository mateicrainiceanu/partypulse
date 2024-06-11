"use client";
import React from "react";
import Live from "./Live";
import BottomBar from "../_components/user/BottomBar";

function page() {
	return (
		<div>
			<Live />
			<BottomBar
				view="live"
				setView={(view) => {
					localStorage.setItem("view", view);
					window.location.href = "/dash";
				}}
			/>
		</div>
	);
}

export default page;
