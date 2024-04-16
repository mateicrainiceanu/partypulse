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
				}}></FormBtn>
			<EventsView></EventsView>
		</div>
	);
}

export default PaEvents;
