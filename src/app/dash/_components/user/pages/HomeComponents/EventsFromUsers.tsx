import React from "react";
import UserSmView from "../../../UserSmView";
import EventView from "../../../EventView";
import {parseEventForView} from "@/app/dash/_lib/data-manager";

interface EvData {
	uname: string;
	role: number;
	eventMatches: Array<{
		reltype: number;
		event: {
			id: number;
			name: string;
			location: string;
			dateStart: string;
			djs: Array<string>;
			status: number;
			userHasRightToManage: number;
			there: boolean;
			coming: boolean;
			liked: boolean;
		};
	}>;
}

function EventsFromUsers({data}: {data: Array<EvData>}) {
	return (
		<div>
			{data.map((evMatch, i) => (
				<div key={i} className="my-2 bg-fuchsia-800 p-2 rounded-xl">
					<div className="">
						<UserSmView uname={evMatch.uname} role={evMatch.role} rounded />
					</div>
					{/* EVENTS */}
					<div className="p-2 my-2 rounded-lg bg-lime-900">
						{evMatch.eventMatches.map((evData) => {
							const ev = parseEventForView(evData.event);
							return (
								<div key={ev.id}>
									<div className="m-2 font-mono">
                                        {evData.reltype == 2 && <p>Is a dj at:</p>}
                                        {evData.reltype == 1 && <p>Is em at:</p>}
                                        {evData.reltype == 4 && <p>Goes:</p>}
                                        {evData.reltype == 5 && <p>Liked:</p>}
                                    </div>
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
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}

export default EventsFromUsers;
