import React from "react";
import EventView from "../dash/_components/EventView";
import {FullEvent} from "@/types";

function EventWithData({ev}: {ev: FullEvent}) {
	return (
		<EventView
			id={ev.id}
			name={ev.name}
			date={ev.dateStart}
			location={ev.location}
			djs={ev.djs}
			showManage={ev.userHasRightToManage > 0}
			status={ev.status}
			there={ev.there}
			coming={ev.coming}
			liked={ev.liked}
		/>
	);
}

export default EventWithData;
