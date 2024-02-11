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
		window.location.replace("/");
	}, []);

	return <div>Spinner</div>;
}

export default Logout;
