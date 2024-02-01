"use client"

import React, {ReactNode, createContext, useEffect, useState} from "react";

interface IUser {
    id:number,
    fname: string, 
    lname: string, 
    email: string,
    token: string
}

interface IChildren {
	children: ReactNode;
}

const UserContext = createContext(null as any);

function UserProvider({children}: IChildren) {
	const [user, setUser] = useState({id: 0, fname: "", lname: "", email: "", token: "", logged: false})

    useEffect(() => {
        console.log(user);
    }, [user])

	return (
		<>
			<UserContext.Provider value={{user, setUser}}>
                {children}
            </UserContext.Provider>
		</>
	);
};

export {UserContext};

export default UserProvider;
