import React from "react";
import {BsCircleFill} from "react-icons/bs";

function StatusPointer({status, lg}: {status: number; lg?: true}) {
	return (
		<div className="flex">
			{status === 0 && (
				<>
					<div className="mt-1.5 text-gray-400">
						<BsCircleFill></BsCircleFill>
					</div>
					{/* <span className="absolute left-10 top-3 text-green-500">Live</span> */}
				</>
			)}
			{status === 1 && (
				<>
					<div className="mt-1.5 text-green-500">
						<BsCircleFill></BsCircleFill>
					</div>
					{/* <span className="absolute left-10 top-3 text-green-500">Live</span> */}
				</>
			)}

			{status === 2 && (
				<>
					<div className="mt-1.5 text-red-500">
						<BsCircleFill></BsCircleFill>
					</div>
				</>
			)}
			{lg && (
				<>
					{status === 0 && <span className="ms-2 mt-1 text-gray-400">Not Started</span>}
					{status === 1 && <span className="ms-2 mt-1 text-green-500">Live</span>}
					{status === 2 && <span className="ms-2 mt-1 text-red-500">Ended</span>}
				</>
			)}
		</div>
	);
}

export default StatusPointer;
