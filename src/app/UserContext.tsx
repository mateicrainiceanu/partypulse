"use client";

import React, {ReactNode, createContext, useContext, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {LoadingContext} from "./LoadingContext";
import {getCookie} from "cookies-next";
import {AlertContext} from "./AlertContext";
import {useSession} from "next-auth/react";
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
	});
	const [tried, setTried] = useState(false);

	const setLoading = useContext(LoadingContext);
	const {handleAxiosError} = useContext(AlertContext);

	useEffect(() => {
		const startUser = {
			id: Number(getCookie("userId")) || 0,
			fname: getCookie("fname") || "",
			lname: getCookie("lname") || "",
			uname: getCookie("uname") || "",
			email: getCookie("email") || "",
			token: getCookie("token") || "",
			logged: getCookie("fname") != undefined ? true : false,
			role: Number(getCookie("role")) || 0,
			donations: getCookie("donations") || "",
		};

		setUser(startUser);

		if ((getCookie("userId") == undefined || getCookie("userId") == "") && getCookie("token") != "") {
			getUserData(false);
		}
		setLoading(false);
	}, []);

	async function getUserData(mandatory: boolean) {
		setLoading(true);
		// await axios
		// 	.get("/api/user")
		// 	.then((response) => {
		// 		setUser({...(response as AxiosResponse).data, logged: true});
		// 		setTried(true);
		// 	})
		// 	.catch((error) => {
		// 		setTried(true);
		// 		if (mandatory) {
		// 			handleAxiosError(error);
		// 			window.location.replace("/login");
		// 		}
		// 		return;
		// 	});
		setLoading(false);
	}

	return (
		<>
			<UserContext.Provider value={{user, setUser, getUserData, tried}}>{children}</UserContext.Provider>
		</>
	);
}

export {UserContext};

export default UserProvider;
