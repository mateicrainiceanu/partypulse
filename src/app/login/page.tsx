"use client";
import FormElement from "@/components/FormElement";
import Link from "next/link";
import React, {useContext, useState} from "react";
import axios from "axios";
import { LoadingContext } from "../LoadingContext";
import { AlertContext } from "../AlertContext";

function Login() {
	const [formData, setFormData] = useState({email: "", password: ""});
	const setLoading = useContext(LoadingContext);
	const {handleAxiosError} = useContext(AlertContext)

	function handleChange(e: any) {
		setFormData((prevData) => ({...prevData, [e.target.name]: e.target.value}));
	}

	async function handeSubmit() {
		setLoading(true)
		await axios
			.post("/api/login", formData)
			.then((response) => {
				window.location.replace("/dash");
			})
			.catch((error) => {
				handleAxiosError(error)
				setLoading(false)
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
				<Link className="text-gray-300 hover:text-gray-100" href="/register">
					{"Don't have an account? Register here!"}
				</Link>
			</div>
		</main>
	);
}

export default Login;
