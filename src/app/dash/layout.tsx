"use client"

import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";

export default function Layout({children}: {children: React.ReactNode}) {
	const {user, getUserData} = useContext(UserContext)
    useEffect(()=>{
			getUserData(true);
			//eslint-disable-next-line
		}, []);

	return (
		<>
			{children}
		</>
	);
}
