import React, {useContext, useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import {BsXCircleFill} from "react-icons/bs";
import axios from "axios";
import "./../../em/manage-location/[id]/location.css";
import {AlertContext} from "@/app/AlertContext";

interface IProps {
	djs: Array<string>;
	setData: any;
}

export function DJSelector({djs, setData}: IProps) {
	const [fieldVal, setFieldVal] = useState("");
	const [opt, setOpt] = useState([]);
	const [selected, setSelected] = useState("");

	const {handleAxiosError} = useContext(AlertContext);

	useEffect(getoptions, [fieldVal]);

	function getoptions() {
		if (fieldVal != "") {
			axios
				.post("/api/user/partner/avalabile", {q: fieldVal, role: 2, seeSelf: true})
				.then((response) => {
					setOpt(response.data);
				})
				.catch((err) => {
					handleAxiosError(err);
				});
		}
	}

	return (
		<div>
			<div className="w-full flex">
				<div className="w-3/4">
					<Autocomplete
						isOptionEqualToValue={() => true}
						className="bg-white rounded-lg"
						options={opt}
						onChange={(e: any) => {
							setSelected(e.target.innerText);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="filled"
								label="username"
								onChange={(e: any) => {
									setSelected("");
									setFieldVal(e.target.value);
								}}
								value={fieldVal}
							/>
						)}></Autocomplete>
				</div>
				<div className="w-1/4 px-2">
					<button
						className={
							"h-full rounded-lg w-full " + (selected === "" ? "bg-gray-300" : "bg-purple-500 hover:bg-purple-400")
						}
						onClick={() => {
							if (selected !== "") {
								if (djs.filter((djname) => djname === selected).length > 0) {
									alert("Already exists");
								} else {
									setData((prev: any) => ({...prev, djs: [selected, ...prev.djs]}));
								}
							}
						}}>
						Add
					</button>
				</div>
			</div>
			<div>
				{djs.length > 0 && (
					<div className="table-container">
						<table className="my-2 w-full text-left">
							<thead className="bg-gray-800 h-9">
								<tr>
									<td></td>
									<td>Username</td>
								</tr>
							</thead>
							<tbody>
								{djs.map((dj, i) => (
									<tr className="h-9" key={i}>
										<td
											onClick={() => {
												setData((prev: any) => ({...prev, djs: djs.filter((djname) => djname !== dj)}));
											}}>
											<i className="text-red-400 hover:text-red-500">
												<BsXCircleFill></BsXCircleFill>
											</i>
										</td>
										<td>{dj}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
