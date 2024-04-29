import React from "react";
import {MdHeadphones} from "react-icons/md";

function DJView({djs}: {djs: Array<string>}) {
	return (
		<div className="p-2 bg-purple-600 text-center font-mono rounded-lg">
			<h1 className="text-xl my-1">{"DJ's"}</h1>
			<hr className="border-2" />
			<div className="text-left">
				{djs.map((dj, i) => (
					<div
						className="flex p-2 py-3 border-white"
						style={{borderBottomStyle: "solid", borderBottomWidth: "2px"}}
						key={i}>
						<MdHeadphones className="text-2xl mx-3" />
						<p className="">{dj}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default DJView;
