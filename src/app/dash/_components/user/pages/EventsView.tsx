import React, {useState} from "react";
import Events from "../../Events";
import FormElement from "@/app/components/FormElement";

function EventsView() {
	const [filter, setFilter] = useState("");
	return (
		<div className="max-w-lg mx-auto">
			<FormElement
				name="filter"
				label="Search"
				handleChange={(e: any) => {
					setFilter(e.target.value);
				}}
				value={filter}></FormElement>

			<Events filter={filter} />
		</div>
	);
}

export default EventsView;
