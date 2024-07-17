"use client";
import React, {createContext, useContext, useEffect, useState} from "react";
import {ReactNode} from "react";
import {LoadingContext} from "./LoadingContext";

const LoadManContext = createContext({
	addLoadingItem: () => {},
	finishedLoadingItem: () => {},
	addSmallLoad: () => {},
	finishSmallLoad: () => {},
});

function LoadManProvider({children}: {children: ReactNode}) {
	const {setLoading, setSmallLoading} = useContext(LoadingContext);

	const [lsum, setLSum] = useState(0);
	const [ssum, setSSum] = useState(0);

	function addLoadingItem() {
		setLSum((sum: number) => sum + 1);
	}

	function finishedLoadingItem() {
		setLSum((sum: number) => sum - 1);
	}

	function addSmallLoad() {
		setSSum((sum) => sum + 1);
	}

	function finishSmallLoad() {
		setSSum((sum) => sum - 1);
	}

	useEffect(() => {
		if (lsum < 1) {
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [lsum]);

	useEffect(() => {
		if (ssum < 1) {
			setSmallLoading(false);
		} else {
			setSmallLoading(true);
		}
	}, [ssum]);

	return (
		<LoadManContext.Provider value={{addLoadingItem, finishedLoadingItem, addSmallLoad, finishSmallLoad}}>
			{children}
		</LoadManContext.Provider>
	);
}

export {LoadManContext};
export default LoadManProvider;
