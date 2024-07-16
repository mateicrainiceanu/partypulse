import {AlertContext} from "@/app/AlertContext";
import {Autocomplete, TextField} from "@mui/material";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";

function UserSelector({evid}: {evid: number}) {
	const [fieldVal, setFieldVal] = useState("");
	const [opt, setOpt] = useState([]);
	const [selected, setSelected] = useState({uname: "", id: 0, role: 0});

	const {handleAxiosError, handleError} = useContext(AlertContext);

	useEffect(getoptions, [fieldVal]);

	function getoptions() {
		if (fieldVal != "")
			axios
				.post("/api/search", {searchQuery: fieldVal, category: "users"})
				.then((response) => {
					setOpt(response.data.results);
				})
				.catch((err) => {
					handleAxiosError(err);
				});
	}

	function addUser() {
		if (selected.id) axios.post("/api/event/invite", {userToAdd: selected.id, evid: evid}).then(res => {
            handleError("Succesfully added user " + selected.uname)
        }).catch(handleAxiosError);
	}

	return (
		<div>
			<div className="flex">
				<div className="w-3/4">
					<Autocomplete
						isOptionEqualToValue={() => true}
						className="bg-white rounded-lg"
						getOptionLabel={(opt: {uname: string}) => opt.uname}
						options={opt}
						onChange={(e: any, val: any) => {
							setSelected(val);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="filled"
								label="username"
								onChange={(e: any) => {
									setFieldVal(e.target.value);
								}}
								value={fieldVal}
							/>
						)}></Autocomplete>
				</div>
				<div className="w-1/4 px-2">
					<button
						className={
							"h-full rounded-lg w-full " + (!selected?.id ? "bg-gray-300" : "bg-purple-500 hover:bg-purple-400")
						}
						onClick={addUser}>
						Add
					</button>
				</div>
			</div>
		</div>
	);
}

export default UserSelector;
