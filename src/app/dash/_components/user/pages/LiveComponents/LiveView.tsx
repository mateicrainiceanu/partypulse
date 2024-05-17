import React from "react";
import DJView from "@/app/components/DJView";
import MSuggestions from "./MSuggestions";
import GenreVote from "./GenreVote";
import {FullEvent} from "@/types";

function LiveView({event, setEvent}: {setEvent: (event: FullEvent) => void; event: FullEvent}) {
	return (
		<div>
			<div className="max-w-xl mx-auto py-2">
				<h1 className="text-2xl font-mono text-center">{event.name}</h1>
				<hr className="my-2" />
				<DJView djs={event.djs} />
				<hr className="my-2" />
				{event.genreVote == 1 && <GenreVote eventId={event.id} />}
				{event.msuggestions == 1 && <MSuggestions setEvent={setEvent} eventId={event.id} />}
			</div>
		</div>
	);
}

export default LiveView;
