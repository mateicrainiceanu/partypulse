import React from "react";
import { IoMdCloseCircle } from "react-icons/io";

function NewEvent({close}: {close: any}) {
	return (
		<div>
			<div className="fixed inset-10 sm:inset-y-40 sm:inset-x-20 rounded-2xl bg-slate-700 p-5 overflow-y-scroll z-10">
				<button className="absolute right-5 top-5 text-2xl" onClick={close}>
					<IoMdCloseCircle />
				</button>
			</div>
		</div>
	);
}

export default NewEvent;
