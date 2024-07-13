import React, {useEffect, useState} from "react";
import FormElement from "@/app/components/FormElement";
import {FormControl, Select, MenuItem, InputLabel} from "@mui/material";
import Users from "./SearchPageComp/Users";
import axios from "axios";
import Locations from "./SearchPageComp/Locations";
import Events from "../../Events";

function SearchPage() {
	const [searchData, setSearchData] = useState({
		searchQuery: "",
		category: "users",
	});

	const [responseData, setResponseData] = useState([]);

	useEffect(() => {
		setSearchData({
			category: localStorage.getItem("category") || "users",
			searchQuery: localStorage.getItem("searchQuery") || "",
		});
	}, []);

	useEffect(() => {
		search();
	}, [searchData]);

	function handleChange(e: any) {
		setSearchData((prev) => ({...prev, [e.target.name]: e.target.value}));

		if (e.target.name === "category") {
			console.log("Clearing responses");

			setResponseData([]);
			localStorage.setItem("category", e.target.value);
		} else if (e.target.name === "searchQuery" && e.target.value != "") {
			localStorage.setItem("searchQuery", e.target.value);
		} else {
			localStorage.setItem("searchQuery", e.target.value);
		}
	}

	function search() {
		if (searchData.searchQuery != "") {
			axios
				.post("/api/search", {
					category: searchData.category,
					searchQuery: searchData.searchQuery,
				})
				.then((response) => {
					if (response.data.category == searchData.category) {
						setResponseData(response.data.results);
					}
				});
		}
	}

	return (
		<div className="text-center">
			<h1 className="font-mono text-2xl">Search</h1>
			<div className="flex max-w-xl mx-auto gap-1">
				<div className="w-3/4">
					<FormElement
						name="searchQuery"
						label="Search"
						handleChange={handleChange}
						value={searchData.searchQuery}></FormElement>
				</div>
				<div className="w-1/4 rounded-lg my-2">
					<FormControl fullWidth variant="filled" className="bg-white rounded-lg">
						<InputLabel id="demo-simple-select-label">Category</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							name="category"
							value={searchData.category}
							label="Category"
							onChange={handleChange}>
							<MenuItem value={"users"}>Users</MenuItem>
							<MenuItem value={"events"}>Events</MenuItem>
							<MenuItem value={"locations"}>Locations</MenuItem>
						</Select>
					</FormControl>
				</div>
			</div>

			{searchData.category === "users" && <Users users={responseData} />}
			{searchData.category === "locations" && <Locations locations={responseData} />}
			{searchData.category === "events" && <Events givenEvents={responseData} />}
		</div>
	);
}

export default SearchPage;
