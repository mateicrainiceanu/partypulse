"use client";

import {useContext, useEffect} from "react";
import {UserContext} from "../UserContext";
import {LoadingContext} from "../LoadingContext";

export default function Layout({children}: {children: React.ReactNode}) {
	const {user, tried} = useContext(UserContext);
	const setLoading = useContext(LoadingContext);

	
	useEffect(() => {
		setLoading(true);
		if (user.id === 0 && tried) {
			window.location.replace("/login");
		} else {
			setLoading(false)
		}
		//eslint-disable-next-line
	}, [user, tried]);

	return <>{children}</>;
}
