"use client";
import React, {createContext, useContext, useEffect, useState} from "react";
import {ReactNode} from "react";
import {LoadingContext} from "./LoadingContext";

const LoadManContext = createContext({addLoadingItem: () => {}, finishedLoadingItem: () => {}});

function LoadManProvider({children}: {children: ReactNode}) {
	const setLoading = useContext(LoadingContext);
	//setLoading(true);

	const [lsum, setLSum] = useState(0);

	function addLoadingItem() {
		setLSum((sum: number) => sum + 1);
	}

	function finishedLoadingItem() {
		setLSum((sum: number) => sum - 1);
	}

	useEffect(() => {        
		if (lsum < 1) {
			setLoading(false);
		} else {
            setLoading(true);
        }
	}, [lsum]);

	return <LoadManContext.Provider value={{addLoadingItem, finishedLoadingItem}}>{children}</LoadManContext.Provider>;
}

export {LoadManContext};
export default LoadManProvider;
