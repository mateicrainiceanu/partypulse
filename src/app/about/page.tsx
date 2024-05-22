"use client";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import {AlertContext} from "../AlertContext";
import { RotateLoader } from "react-spinners";

function About() {
	const [users, setUsers] = useState(0);
	const {handleAxiosError} = useContext(AlertContext);

	useEffect(() => {
		axios
			.get("/api/user/count")
			.then((res) => {
				setUsers(res.data);
			})
			.catch(handleAxiosError);
	}, []);

	return (
		<div className="p-24 text-center">
			<h1 className="font-bold text-6xl tracking-widest">About Partypulse</h1>
			<div className="my-32 text-center">
				<span className="text-6xl">
					{users == 0 ? <RotateLoader margin={5} color={"magenta"}/> :<span className="font-bold animate-pulse">{users}</span>} users
				</span>
			</div>
		</div>
	);
}

export default About;
