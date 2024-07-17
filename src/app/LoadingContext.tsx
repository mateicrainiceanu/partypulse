"use client";

import React, {createContext, ReactNode, useState} from "react";
import Spinner, {SmallSpinner} from "@/app/components/Spinner";

const LoadingContext = createContext(null as any);

interface IChildren {
	children: ReactNode;
}

function LoadingProvider({children}: IChildren) {
	const [loading, setLoading] = useState(true);
	const [smallLoading, setSmallLoading] = useState(false);

	return (
		<>
			<LoadingContext.Provider value={{setLoading, setSmallLoading}}>
				{loading && <Spinner />}
				{smallLoading && <SmallSpinner />}
				{children}
			</LoadingContext.Provider>
		</>
	);
}

export default LoadingProvider;
export {LoadingContext};
