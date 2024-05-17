"use client";
import FormElement from "@/app/components/FormElement";
import Link from "next/link";
import React, {useContext, useState} from "react";
import axios from "axios";
import {LoadingContext} from "../LoadingContext";
import {AlertContext} from "../AlertContext";
import {signIn, SignInResponse} from "next-auth/react";
import {BsGoogle} from "react-icons/bs";

function Login() {
	const [formData, setFormData] = useState({email: "", password: ""});
	const setLoading = useContext(LoadingContext);
	const {handleError, handleAxiosError} = useContext(AlertContext);

	function handleChange(e: any) {
		setFormData((prevData) => ({...prevData, [e.target.name]: e.target.value}));
	}

	async function handeSubmit() {
		// setLoading(true);
		// const {ok, error} = (await signIn("credentials", {...formData, redirect: false})) as SignInResponse;

		// if (ok) window.location.replace("/dash");
		// else handleError(error, "error");

		// setLoading(false);

		await axios
			.post("/api/login", formData)
			.then((response) => {
				window.location.replace("/dash");
			})
			.catch((error) => {
				handleAxiosError(error);
				setLoading(false);
			});
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
				<button
					onClick={handeSubmit}
					type="submit"
					className="rounded-md w-full my-4 bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
					Login
				</button>
				<button
					onClick={() => {
						signIn("google").then(() => {
							window.location.replace("/dash");
						});
					}}
					type="submit"
					className="rounded-md w-full mb-2 px-3 py-2 text-sm bg-white hover:bg-gray-300 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
					<div className="flex gap-2 justify-center text-black">
						<BsGoogle className="my-auto" /> <span className="my-auto">Sign in with Google</span>
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
