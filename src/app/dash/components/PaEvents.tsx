import React from "react";

import FormBtn from "@/components/FormBtn";
import EventsView from "./EventsView";

function PaEvents() {
	return (
		<div>
			<h3 className="font-bold text-xl mt-2">Events</h3>
			<FormBtn
				name="New"
				onClick={() => {
					localStorage.setItem("prevUrl", window.location.pathname);
					console.log(window.location.pathname);
				}}></FormBtn>
			<EventsView></EventsView>
		</div>
	);
}

export default PaEvents;
