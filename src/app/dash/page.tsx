"use client";

import React, {useEffect} from "react";
import axios from "axios";

function Dash() {
	useEffect(() => {
        console.log(getUserData());
    }, []);

	async function getUserData() {
		const response = await axios.get("/api/user");
		console.log(response.data);
	}

	return <div>Dash</div>;
}

export default Dash;
