"use client";

import React, {SyntheticEvent, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import axios from "axios";

function AddUser({id}: {id: string}) {
	const [fieldVal, setFieldVal] = useState("");
	const [opt, setOpt] = useState([]);

	function getoptions(q: string) {
		if (q) {
			axios
				.post("/api/partner/avalabile", {q: q})
				.then((response) => {
					setOpt(response.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	function addUser() {
		axios.post("/api/user/location", {username: fieldVal, locationId: id}).then((response) => {
			window.location.reload();
		});
	}

	return (
		<div className="w-full p-3 flex">
			<div className="bg-white rounded-lg w-3/4">
				<Autocomplete
					options={opt}
					value={fieldVal}
					onChange={(event: SyntheticEvent<Element, Event>, value: string | null) => {
						if (value) {
							setFieldVal(value);
						}
					}}
					filterOptions={(options)=>options}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="filled"
							label="username or email"
							onChange={(e: any) => {
								getoptions(e.target.value);
							}}
						/>
					)}/>
			</div>
			<div className="w-1/4 px-2">
				<button className="bg-purple-500 hover:bg-purple-400 w-full h-full rounded-lg text-xl" onClick={addUser}>
					Add
				</button>
			</div>
		</div>
	);
}

export default AddUser;
