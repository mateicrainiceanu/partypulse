import React, {useState} from "react";
import UserSmView from "../../../UserSmView";
import {Pagination} from "@mui/material";

function Users({users}: {users: Array<{uname: string; role: number}>}) {
	const [pag, setpag] = useState(1);
	const showOnPage = 7;

	return (
		<div className="max-w-xl mx-auto">
			{users.length > 0 &&
				users
					.slice((pag - 1) * showOnPage, pag * showOnPage)
					.map((user: {uname: string; role: number}, i: number) => (
						<UserSmView key={user.uname} uname={user.uname} role={user.role} />
					))}
			{users.length > showOnPage && (
				<div className="flex justify-center my-2">
					<Pagination
						count={Math.ceil(users.length / showOnPage)}
						page={pag}
						onChange={(_: any, val: number) => {
							setpag(val);
						}}
					/>
				</div>
			)}
		</div>
	);
}

export default Users;
