"use client";

import React, {ReactNode, createContext, useContext, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {LoadingContext} from "./LoadingContext";
import {getCookie} from "cookies-next";
import {AlertContext} from "./AlertContext";
import {useSession} from "next-auth/react";
import {verify} from "crypto";
import LoadManProvider, {LoadManContext} from "./LoadManContext";
interface IUser {
	id: number;
	fname: string;
	lname: string;
	email: string;
	token: string;
}

const UserContext = createContext(null as any);

function UserProvider({children}: {children: ReactNode}) {
	const [user, setUser] = useState({
		id: 0,
		fname: "",
		lname: "",
		uname: "",
		email: "",
		token: "",
		logged: false,
		donations: "",
		emailNotif: 1
	});
	const [tried, setTried] = useState(false);
	const {handleAxiosError} = useContext(AlertContext);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	//addLoadingItem();

	useEffect(() => {
		addLoadingItem();
		const startUser = {
			id: Number(getCookie("userId")) || 0,
			fname: getCookie("fname") || "",
			lname: getCookie("lname") || "",
			uname: getCookie("uname") || "",
			email: getCookie("email") || "",
			token: getCookie("token") || "",
			logged: getCookie("fname") != undefined ? true : false,
			role: Number(getCookie("role")) || 0,
			verified: Number(getCookie("verified")) || 0,
			donations: getCookie("donations") || "",
			emailNotif: Number(getCookie("emailNotif")) || 1
		};

		setUser(startUser);

		if (
			startUser.id != 0 &&
			getCookie("verified") != "1" &&
			!window.location.href.includes("/dash/verify") &&
			window.location.href.includes("/dash")
		)
			window.location.replace("/dash/verify");

		finishedLoadingItem();
	}, []);

	async function getUserData(mandatory: boolean) {}

	return (
		<>
			<UserContext.Provider value={{user, setUser, getUserData, tried}}>{children}</UserContext.Provider>
		</>
	);
}

export {UserContext};

export default UserProvider;
