import React from "react";
import {FaHeadphones} from "react-icons/fa";
import {FaRegUser} from "react-icons/fa";
import {BiParty} from "react-icons/bi";
import "./dash.css";

function UserSmView({uname, role}: {uname: string; role: number}) {
	return (
		<div className="w-full py-3 border-btm">
			<div className="flex gap-3">
				{role === 0 && <FaRegUser className="my-1" />}
				{role === 1 && <BiParty className="my-1" />}
				{role === 2 && <FaHeadphones className="my-1" />}
				<span>{uname}</span>
			</div>
		</div>
	);
}

export default UserSmView;
