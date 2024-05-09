import UserSmView from "@/app/dash/_components/UserSmView";
import React from "react";

function DJView({djs}: {djs: Array<string>}) {
	return (
		<div className="p-2 bg-purple-600 text-center font-mono rounded-lg">
			<h1 className="text-xl my-1">{"DJ's"}</h1>
			<hr className="border-2" />
			<div className="text-left">
				{djs.map((dj, i) => (
					<div key={i} style={{borderBottomStyle: "solid", borderBottomWidth: "2px"}}>
						<UserSmView uname={dj} role={2} />
					</div>
				))}
			</div>
		</div>
	);
}

export default DJView;
