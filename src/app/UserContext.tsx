"use client";

import React, {ReactNode, createContext, useContext, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {LoadingContext} from "./LoadingContext";

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
	const [tried, setTried] = useState(false);

	const setLoading = useContext(LoadingContext);

	async function getUserData(mandatory: boolean) {
		setLoading(true);

		await axios
			.get("/api/user")
			.then((response) => {
				setUser({...(response as AxiosResponse).data, logged: true});
				setTried(true);
			})
			.catch((error) => {				
				setTried(true);

				if (mandatory) {
					window.location.replace("/login");
				}
				return;
			});
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
