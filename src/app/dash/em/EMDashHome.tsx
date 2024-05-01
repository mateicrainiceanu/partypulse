import React from "react";
import PaEvents from "../_components/PaEvents";
import PaLocation from "../_components/PaLocation";

function EMDashHome() {
	return (
		<div className="text-center flex flex-wrap">
			<div className="w-full lg:w-2/3 p-5">
				<PaEvents />
			</div>
			<div className="w-full lg:w-1/3 p-2">
				<PaLocation />
			</div>
		</div>
	);
}

export default EMDashHome;
