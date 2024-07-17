"use client";

import React, {CSSProperties} from "react";
import {PacmanLoader, BounceLoader} from "react-spinners";

function Spinner() {
	const override: CSSProperties = {
		display: "block",
		margin: "0 auto",
		borderColor: "red",
		position: "fixed",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
	};

	return (
		<div className="spinner-cont-div">
			<PacmanLoader
				color={"magenta"}
				loading={true}
				cssOverride={override}
				size={40}
				aria-label="Loading Spinner"
				data-testid="loader"></PacmanLoader>
		</div>
	);
}

export function SmallSpinner() {
	return (
		<div className="fixed left-10 bottom-10">
			<BounceLoader color={"magenta"} loading={true} aria-label="Progress Spinner" data-testid="loader" />
		</div>
	);
}

export default Spinner;
