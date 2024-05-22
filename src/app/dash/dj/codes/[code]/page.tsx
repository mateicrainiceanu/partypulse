"use client";
import React, {useEffect, useState} from "react";
import QrCode from "@/app/components/QrCode";

function CodePreview({params}: {params: {code: string}}) {
	const [host, setHost] = useState("");

	useEffect(() => {
		setHost(window.location.host);		
	}, []);

	return (
		<div className="max-w-lg mx-auto my-2">
			<h1 className="text-3xl font-mono font-bold text-center">SCAN ME ...</h1>
			<hr className="my-2" />
			<div className="w-full px-auto">
				<QrCode link={"http://" + host + "/code/" + params.code} />
			</div>
			<p className="text-lg my-4 font-mono text-center">Join the party...</p>
		</div>
	);
}

export default CodePreview;
