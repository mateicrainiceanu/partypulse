"use client";

import React, {useEffect} from "react";

import {useCookies} from "next-client-cookies";

function Logout() {
	const cookies = useCookies();

	useEffect(() => {
		cookies.remove("token");
		window.location.replace("/");
	}, []);

	return <div>Spinner</div>;
}

export default Logout;
