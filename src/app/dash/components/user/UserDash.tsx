"use client";
import React, {useState} from "react";
import BottomBar from "./BottomBar";

import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Events from "./pages/Events";
import Locations from "./pages/Locations";
import Live from "./pages/Live";

function UserDash() {
	const startStr = window.localStorage.getItem("view") || "home";
	const [view, setView] = useState(startStr);

	return (
		<div>
			<div className="p-3">
				{view === "home" && <Home />}
				{view === "search" && <SearchPage />}
				{view === "events" && <Events />}
				{view === "locations" && <Locations />}
				{view === "live" && <Live />}
			</div>
			<BottomBar view={view} setView={setView}></BottomBar>
		</div>
	);
}

export default UserDash;
