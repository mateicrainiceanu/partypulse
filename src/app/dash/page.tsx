"use client";

import React, {useContext, useEffect} from "react";
import {UserContext} from "../UserContext";
import MiniBar from "./_components/MiniBar";
import UserDash from "./_components/user/UserDash";

function Dash() {
	const {user} = useContext(UserContext);

	return (
		<div>
			{user.role != 0 && <MiniBar fselected="user"></MiniBar>}
			<UserDash></UserDash>
		</div>
	);
}

export default Dash;
