"use client";

import React, {ReactNode, createContext, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";

interface IUser {
	id: number;
	fname: string;
	lname: string;
	email: string;
	token: string;
}

interface IChildren {
	children: ReactNode;
}

const UserContext = createContext(null as any);

function UserProvider({children}: IChildren) {
	const [user, setUser] = useState({id: 0, fname: "", lname: "", email: "", token: "", logged: false});

	async function getUserData(mandatory: boolean) {
		await axios.get("/api/user").then((response) => {
			setUser({...(response as AxiosResponse).data, logged: true});
		}).catch((error) => {
			if (mandatory) {
				window.location.replace("/login");
			}
			return
		});
	}
		

	// async function isUserLoggedIn() {
	// 	var answ
	// 	await axios.get("/api/user").then(response => {
	// 		if (response.status=200){
	// 			answ = true
	// 		}
	// 	}).catch((error) => {
	// 		answ = false
	// 	});
	// 	console.log(answ);

	// 	return answ;
	// }

	return (
		<>
			<UserContext.Provider value={{user, setUser, getUserData}}>{children}</UserContext.Provider>
		</>
	);
}

export {UserContext};

export default UserProvider;
