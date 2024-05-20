"use client";

import {useContext, useEffect} from "react";
import {UserContext} from "../UserContext";
import {LoadManContext} from "../LoadManContext";

export default function Layout({children}: {children: React.ReactNode}) {
	const {user, tried} = useContext(UserContext);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);

	useEffect(() => {
		addLoadingItem();
		if (user.id === 0 && tried) {
			window.location.replace("/login");
		} else {
			finishedLoadingItem();
		}
		//eslint-disable-next-line
	}, [user, tried]);

	return <>{children}</>;
}
