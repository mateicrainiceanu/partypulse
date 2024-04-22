import React, {useState} from "react";

import FormBtn from "@/components/FormBtn";
import Events from "./Events";
import NewEvent from "./NewEvent";

function PaEvents() {
	const [showAdd, setShowAdd] = useState(false);

	return (
		<div>
			<h3 className="font-bold text-xl mt-2">Events</h3>
			<FormBtn
				name="New"
				onClick={() => {
					setShowAdd(true);
				}}></FormBtn>

			{showAdd && (
				<NewEvent
					close={() => {
						setShowAdd(false);
					}}
				/>
			)}
			<Events />
		</div>
	);
}

export default PaEvents;
