import React from "react";
import {BsSearch, BsHouse, BsCalendar, BsBullseye} from "react-icons/bs";
import {IoLocationOutline} from "react-icons/io5";

function BottomBar({view, setView}: {view: string; setView: (name: string) => void}) {
	function handleViewChange(e: any) {
		setView(e.target.id);
		localStorage.setItem("view", e.target.id);
	}

	return (
		<div className="fixed bottom-0 w-screen left-0 bg-black border-top p-3">
			<div className="w-full flex justify-center md:gap-10 gap-5 text-xl text-white">
				<BsHouse
					className={"hover:text-gray-500 " + (view === "home" ? "text-gray-400" : "")}
					id="home"
					onClick={handleViewChange}
				/>
				<BsSearch
					className={"hover:text-gray-500 " + (view === "search" ? "text-gray-400" : "")}
					id="search"
					onClick={handleViewChange}
				/>
				<BsCalendar
					className={"hover:text-gray-500 " + (view === "events" ? "text-gray-400" : "")}
					id="events"
					onClick={handleViewChange}
				/>
				<IoLocationOutline
					className={"hover:text-gray-500 " + (view === "locations" ? "text-gray-400" : "")}
					id="locations"
					onClick={handleViewChange}
				/>
				<BsBullseye
					className={"hover:text-gray-500 " + (view === "live" ? "text-gray-400" : "")}
					id="live"
					onClick={handleViewChange}
				/>
			</div>
		</div>
	);
}

export default BottomBar;