"use client";
import React from "react";
import MiniBar from "../_components/MiniBar";
import PaEvents from "../_components/PaEvents";
import FormBtn from "@/components/FormBtn";

function DJDash() {
	return (
		<div className="px-5">
			<MiniBar fselected="dj"></MiniBar>
			<div className="flex flex-row justfy-center max-w-6xl mx-auto">
				<div className="md:w-1/2 w-full mx-auto text-center p-2">
					<FormBtn
						name="Manage Codes"
						onClick={() => {
							window.location.href = "/dash/dj/codes";
						}}></FormBtn>
					<PaEvents></PaEvents>
				</div>
			</div>
		</div>
	);
}

export default DJDash;
