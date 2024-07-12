import React from "react";
import {BsSearch, BsHouse, BsCalendar, BsBullseye} from "react-icons/bs";
import {IoLocationOutline} from "react-icons/io5";
import {FaRegUser} from "react-icons/fa";

function BottomBar({view, setView}: {view: string; setView: (name: string) => void}) {
	function handleViewChange(e: any) {
		console.log(e.target.id);
		localStorage.setItem("view", e.target.id);
		if (view === "live") window.location.href = "/dash";
		if (e.target.id === "live") window.location.href = "/dash/live";

		setView(e.target.id);
	}

	return (
		<div className="fixed bottom-0 w-screen left-0 bg-black border-top p-1">
			<div className="w-full flex justify-evenly md:justify-center gap-2 text-xl text-white select-none">
				<button
					className={"p-2 px-3 rounded-md hover:bg-gray-800 " + (view === "home" ? "bg-gray-900" : "")}
					id="home"
					onClick={handleViewChange}>
					<BsHouse />
				</button>
				<button
					className={"p-2 px-3 rounded-md hover:bg-gray-800 " + (view === "search" ? "bg-gray-900" : "")}
					id="search"
					onClick={handleViewChange}>
					<BsSearch />
				</button>
				<button
					className={"p-2 px-3 rounded-md hover:bg-gray-800 " + (view === "events" ? "bg-gray-900" : "")}
					id="events"
					onClick={handleViewChange}>
					<BsCalendar />
				</button>
				<button
					className={"p-2 px-3 rounded-md hover:bg-gray-800 " + (view === "locations" ? "bg-gray-900" : "")}
					id="locations"
					onClick={handleViewChange}>
					<IoLocationOutline />
				</button>
				<button
					className={"p-2 px-3 rounded-md hover:bg-gray-800 " + (view === "users" ? "bg-gray-900" : "")}
					id="users"
					onClick={handleViewChange}>
					<FaRegUser />
				</button>
				<button
					className={"p-2 px-3 rounded-md hover:bg-gray-800 " + (view === "live" ? "bg-gray-900" : "")}
					id="live"
					onClick={handleViewChange}>
					<BsBullseye />
				</button>
			</div>
		</div>
	);
}

export default BottomBar;
