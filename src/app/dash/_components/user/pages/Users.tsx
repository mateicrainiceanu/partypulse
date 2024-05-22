import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import UserSmView from "../../UserSmView";
import FormElement from "@/app/components/FormElement";
import {Pagination} from "@mui/material";
import {AlertContext} from "@/app/AlertContext";
import {LoadManContext} from "@/app/LoadManContext";

function Users() {
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [pg, setPg] = useState(1);
	const showOnPg = 5;

	const {handleAxiosError} = useContext(AlertContext);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);

	useEffect(() => {
		addLoadingItem();
		axios
			.get("/api/user/relation")
			.then((res) => {
				setUsers(res.data);
				finishedLoadingItem();
			})
			.catch((err) => {
				handleAxiosError(err);
			});
	}, []);

	return (
		<div>
			<div className="max-w-lg mx-auto p-2">
				<h1 className="text-center font-mono text-xl font-bold my-2">Liked users</h1>
				<FormElement
					name="search"
					label="Search"
					value={search}
					handleChange={(e: any) => {
						setSearch(e.target.value);
					}}></FormElement>
				{users
					.filter((user: {role: number; id: number; uname: string}) => user.uname.includes(search))
					.slice((pg - 1) * showOnPg, pg * showOnPg)
					.map((user: {role: number; id: number; uname: string}, i) => (
						<div key={user.uname}>
							<UserSmView uname={user.uname} role={user.role} />
						</div>
					))}
				{users.length > showOnPg && (
					<div className="my-2 flex justify-center">
						<Pagination
							page={pg}
							count={Math.ceil(users.length / showOnPg)}
							onChange={(_: any, val: number) => {
								setPg(val);
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default Users;
