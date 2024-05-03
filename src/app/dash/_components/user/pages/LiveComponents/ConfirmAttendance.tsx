import React from "react";

function ConfirmAttendance() {
	return (
		<div className="w-full min-h-96 flex justify-center items-center">
			<div className="max-w-md text-center font-mono bg-black p-3 rounded-lg">
				<h1 className="my-2 text-xl">Confirm Attendance</h1>
				<hr className="my-2"/>
				<p className="font-sans text-left">
					In order to ensure everyones fun, you need to confirm your attendance for every event.
				</p>
				<p className="font-sans text-left">
					This can be done either by scaning one of the qr codes at your location or the one provided by the dj. After
					you have scanned it you will be prompted to the live event page and your attendace will be confirmed for the
					duration of the entire event.
				</p>
                <p className="text-center my-1">
                    Thanks for understanding!
                </p>
			</div>
		</div>
	);
}

export default ConfirmAttendance;
