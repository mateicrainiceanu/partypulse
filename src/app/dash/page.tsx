"use client";

import React, {useContext, useEffect} from "react";
import {UserContext} from "../UserContext";
import MiniBar from "./components/MiniBar";
import UserDash from "./components/UserDash";

function Dash() {
	const {user} = useContext(UserContext);

	return <div>{user.role != 0 ? <MiniBar fselected="user"></MiniBar> : <UserDash />}</div>;
}

export default Dash;
