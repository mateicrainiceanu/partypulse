"use client";

import React, {useEffect, useContext} from "react";

import {useCookies} from "next-client-cookies";
import {LoadingContext} from "../LoadingContext";

function Logout() {
	const cookies = useCookies();

	const setLoading = useContext(LoadingContext);

	useEffect(() => {
		setLoading(true);
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

	return <div>Spinner</div>;
}

export default Logout;
