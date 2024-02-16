"use client";

import React from "react";
import MiniBar from "../components/MiniBar";
import EMDashHome from "./EMDashHome";

function EMDash() {
	return (
		<div>
			<MiniBar fselected="em"></MiniBar>
			<div className="container p-2 mx-auto max-w-lg">
				<EMDashHome></EMDashHome>
			</div>
		</div>
	);
}

export default EMDash;
