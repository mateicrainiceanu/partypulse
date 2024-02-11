"use client";

import React, {createContext, ReactNode, useState} from "react";
import Spinner from "@/components/Spinner";

const LoadingContext = createContext(null as any);

interface IChildren {
	children: ReactNode;
}

function LoadingProvider({children}: IChildren) {
	const [loading, setLoading] = useState(false);

	return (
		<>
			<LoadingContext.Provider value={setLoading}>
				{loading && <Spinner />}
				{children}
			</LoadingContext.Provider>
		</>
	);
}

export default LoadingProvider;
export {LoadingContext}
