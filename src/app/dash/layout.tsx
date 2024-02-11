"use client"

import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";

export default function Layout({children}: {children: React.ReactNode}) {
	const {user} = useContext(UserContext)
    useEffect(()=>{
		if (!user.logged) {
			window.location.replace("/login")
		}
    }, []);
	
	return (
		<>
			{children}
		</>
	);
}
