"use client";

import React, {useContext, useEffect} from "react";
import {UserContext} from "../UserContext";

function Dash() {
	const {user} = useContext(UserContext);
	
	return (
		<div>
			<h1>User</h1>
			<span>{user.fname}</span>
			<span>{user.email}</span>
		</div>
	);
}

export default Dash;
