"use client"

import { useEffect } from "react";

export default function Layout({children}: {children: React.ReactNode}) {
    useEffect(()=>{
        console.log("here");
    }, [])
	return (
		<>
			{children}
		</>
	);
}
