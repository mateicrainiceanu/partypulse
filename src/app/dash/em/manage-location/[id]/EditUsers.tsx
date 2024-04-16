"use client";
import "./location.css";
import {TextField} from "@mui/material";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {BsXCircleFill} from "react-icons/bs";

function EditUsers({id}: {id: string}) {
	const [users, setUsers] = useState([]);

	const [search, setSearch] = useState("");

	useEffect(() => {
		axios.get("/api/location/" + id + "/users").then((response) => {
			setUsers(response.data);
		});
	}, []);

	function deleteUser(uid: number) {
		axios.delete("/api/location/" + id + "/users/" + uid).then((response) => {
			setUsers(response.data);
		});
	}

	return (
		<div className="w-full">
			<div className="rounded-lg bg-white my-2">
				<TextField
					className="w-full "
					value={search}
					onChange={(e: any) => {
						setSearch(e.target.value);
					}}
					variant="filled"
					label="Search"
				/>
			</div>
			<div className="table-container">
				<table className="w-full text-center ">
					<thead>
						<tr className="h-9 bg-gray-800">
							<td>username</td>
							<td></td>
						</tr>
					</thead>
					<tbody className="overflow-y-scroll max-h-10 tablebody">
						{users
							.filter((user: {id: number; uname: string}) => user.uname.includes(search))
							.map((user: {id: number; uname: string}) => (
								<tr key={user.id} className="h-8">
									<td>{user.uname}</td>
									<td className="text-center py-3">
										<i className="text-red-400 hover:text-red-500 ">
											<BsXCircleFill
												onClick={() => {
													deleteUser(user.id);
												}}
											/>
										</i>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default EditUsers;
