"use client";
import React, {useState, useEffect, useContext} from "react";
import NewEvent from "./NewEvent";
import FormElement from "@/app/components/FormElement";
import "./dash.css";
import Events from "./_Events";

function PaEvents() {
	const [showAdd, setShowAdd] = useState(false);
	const [search, setSearch] = useState("");

	return (
		<div>
			<h3 className="font-bold text-xl mt-2">My Events</h3>
			{/* SEARCH-MENU BAR */}
			<div className="flex justify-center my-2">
				<div className="w-1/2">
					<FormElement
						name="search"
						label="Search"
						value={search}
						handleChange={(e: any) => {
							setSearch(e.target.value);
						}}></FormElement>
				</div>
				<button
					className="mx-2 my-2 p-2 bg-purple-500 rounded-lg"
					onClick={() => {
						setShowAdd(true);
					}}>
					Create
				</button>
			</div>
			{showAdd && (
				<NewEvent
					close={() => {
						setShowAdd(false);
					}}
				/>
			)}

			<Events filter={search} onlyManaged></Events>
		</div>
	);
}

export default PaEvents;
