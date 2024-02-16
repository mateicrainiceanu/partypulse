import React from "react";
import PaEvents from "../components/PaEvents";
import PaLocation from "../components/PaLocation";

function EMDashHome() {
	return (
		<div className="text-center">
			<PaEvents />
			<PaLocation />
		</div>
	);
}

export default EMDashHome;
