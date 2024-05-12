import {FullEvent, FullLocation} from "@/types";
import React, { useState } from "react";
import LocationSmView from "../../../LocationSmView";
import {parseEventForView} from "@/app/dash/_lib/data-manager";
import EventView from "../../../EventView";

interface EvDataLoc {
	location: FullLocation;
	events: Array<FullEvent>;
}

function EventsFormLocations({data}: {data: EvDataLoc[]}) {

	return (
		<div className="my-4 bg-blue-800 p-2 rounded-xl">
			{data.map((e, i) => (
				<div key={i}>
					<div>
						<LocationSmView locationData={e.location} />
					</div>
					{e.events.slice(0,1).map((evData) => {
                        //SHOW ONLY SOME EVENTS
						const ev = parseEventForView(evData);
						return (
							<EventView
								key={ev.id}
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
					})}
				</div>
			))}
		</div>
	);
}

export default EventsFormLocations;
