"use client";
import React, {useEffect, useState} from "react";
import BottomBar from "./BottomBar";

import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import EventsView from "./pages/EventsView";
import Locations from "./pages/Locations";
import Live from "./pages/Live";
import Users from "./pages/Users";

function UserDash() {
	const startStr = "search";
	const [view, setView] = useState(startStr);

	useEffect(() => {
		if (localStorage.getItem("view") != null) setView(localStorage.getItem("view") || startStr);
	}, []);

	return (
		<div>
			<div className="p-3 mb-10">
				{view === "home" && <Home />}
				{view === "search" && <SearchPage />}
				{view === "events" && <EventsView />}
				{view === "locations" && <Locations />}
				{view === "users" && <Users />}
				{view === "live" && <Live />}
			</div>
			<BottomBar view={view} setView={setView}></BottomBar>
		</div>
	);
}

export default UserDash;
