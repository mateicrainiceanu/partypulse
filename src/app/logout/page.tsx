"use client";

import React, {useEffect, useContext} from "react";

import {useCookies} from "next-client-cookies";
import {LoadingContext} from "../LoadingContext";
import {LoadManContext} from "../LoadManContext";
import Spinner from "../components/Spinner";

function Logout() {
	const cookies = useCookies();

	const {addLoadingItem} = useContext(LoadManContext);

	useEffect(() => {
		addLoadingItem();
		cookies.remove("token");
		cookies.remove("userId");
		cookies.remove("uname");
		cookies.remove("fname");
		cookies.remove("lname");
		cookies.remove("role");
		cookies.remove("email");
		cookies.remove("donations");
		window.location.replace("/");
	}, []);

	return <div></div>;
}

export default Logout;
