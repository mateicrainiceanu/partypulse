"use client";
import FormElement from "@/app/components/FormElement";
import Link from "next/link";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {LoadingContext} from "../LoadingContext";
import {AlertContext} from "../AlertContext";
import {signIn} from "next-auth/react";
import {BsGoogle, BsSpotify} from "react-icons/bs";
import {deleteCookie, getCookie} from "cookies-next";
import {LoadManContext} from "../LoadManContext";

function Login() {
	const [formData, setFormData] = useState({email: "", password: ""});
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const {handleAxiosError} = useContext(AlertContext);

	useEffect(() => {		
		if (getCookie("token") != undefined) {
			window.location.replace("/dash");
		}
	}, []);

	function handleChange(e: any) {
		setFormData((prevData) => ({...prevData, [e.target.name]: e.target.value}));
	}

	async function handeSubmit() {
		addLoadingItem();

		await axios
			.post("/api/user/login", formData)
			.then((response) => {
				if (getCookie("prevUrl") != undefined && getCookie("prevUrl") != "")
					window.location.replace(getCookie("prevUrl") || "/dash");
				else window.location.replace("/dash");
				deleteCookie("prevUrl");
			})
			.catch(handleAxiosError);
	}

	return (
		<main className="flex min-h-screen items-center mx-auto flex-col justify-center p-10 max-w-xl">
			<div className="text-center">
				<h2 className="text-3xl font-bold font-sans my-10">Login</h2>
				<FormElement name="email" type="email" label="Email" handleChange={handleChange} value={formData.email} />
				<FormElement
					name="password"
					type="password"
					label="Password"
					handleChange={handleChange}
					value={formData.password}
				/>
				<Link className="text-gray-300 hover:text-gray-100" href="/login/forgot-password">
					{"Password reset"}
				</Link>
				<button
					onClick={handeSubmit}
					type="submit"
					className="rounded-md w-full my-4 bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
					Login
				</button>
				<button
					onClick={() => {
						signIn("google");
					}}
					type="submit"
					className="rounded-md w-full mb-2 px-3 py-2 text-sm bg-white hover:bg-gray-300 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
					<div className="flex gap-2 justify-center text-black">
						<BsGoogle className="my-auto" /> <span className="my-auto">Sign in with Google</span>
					</div>
				</button>
				<button
					onClick={() => {
						signIn("spotify");
					}}
					type="submit"
					className="rounded-md w-full mb-2 px-3 py-2 text-sm bg-white hover:bg-gray-300 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
					<div className="flex gap-2 justify-center text-black">
						<BsSpotify className="my-auto" /> <span className="my-auto">Sign in with Spotify</span>
					</div>
				</button>
				<Link className="text-gray-300 hover:text-gray-100" href="/register">
					{"Don't have an account? Register here!"}
				</Link>
			</div>
		</main>
	);
}

export default Login;
