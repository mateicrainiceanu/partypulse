"use client";
import React from "react";
import MiniBar from "../components/MiniBar";
import PaEvents from "../components/PaEvents";

function DJDash() {
	return (
		<div className="px-5">
			<MiniBar fselected="dj"></MiniBar>
			<div className="max-w-lg mx-auto text-center p-2">
				<PaEvents></PaEvents>
			</div>
		</div>
	);
}

export default DJDash;
