"use client";
import FormElement from "@/components/FormElement";
import axios from "axios";
import Link from "next/link";
import React, {useContext, useState} from "react";
import {UserContext} from "../UserContext";
import {LoadingContext} from "../LoadingContext";
import {AlertContext} from "../AlertContext";

function Register() {
	const [formData, setFormData] = useState({fname: "", lname: "", uname: "", email: "", password: ""});
	const [avalabile, setAvalabile] = useState(false);
	const setLoading = useContext(LoadingContext);

	const {user, setUser} = useContext(UserContext);
	const {handleAxiosError, dialogToUser} = useContext(AlertContext);

	async function handleChange(e: any) {
		if (e.target.name === "uname") {
			const username = e.target.value.replaceAll(" ", "");
			setFormData((prevData) => ({...prevData, uname: username}));
			axios
				.post("/api/username-check", {username: username})
				.then((_) => {
					setAvalabile(true);
				})
				.catch((_) => {
					setAvalabile(false);
				});
		} else {
			setFormData((prevData) => ({...prevData, [e.target.name]: e.target.value}));
		}
	}

	function handleRegister() {
		if (!avalabile) {
			dialogToUser({
				title: "Unavalabile usename",
				content:
					"In order to ensure our users experience, the usernames on our platform should be unique. Please choose another username and check the below avalability checker if the username is avalabile.",
			});
			return;
		}

		setLoading(true);

		axios
			.post("/api/register", formData)
			.then((response) => {
				const {newuser, id, token} = response.data;

				setUser({...newuser, logged: true, id: id, token: token});

				window.location.replace("/dash");
			})
			.catch((error) => {
				handleAxiosError(error);
			});
	}

	return (
		<main className="flex min-h-screen items-center mx-auto flex-col justify-center max-w-4xl">
			<div className="text-center w-full p-5">
				<h2 className="text-3xl font-bold font-sans my-10">Register</h2>
				<div className="flex flex-row flex-wrap">
					<div className="md:basis-1/2 basis-full px-2">
						<FormElement
							name="fname"
							type="name"
							label="First Name"
							handleChange={handleChange}
							value={formData.fname}
						/>
						<FormElement
							name="lname"
							type="name"
							label="Last Name"
							handleChange={handleChange}
							value={formData.lname}
						/>
						<FormElement name="uname" type="name" label="Username" handleChange={handleChange} value={formData.uname} />
						<p>Avalabile: {avalabile ? "YES" : "NO"}</p>
					</div>
					<div className="md:basis-1/2 basis-full px-2 flex justify-center items-center">
						<div className="w-full">
							<FormElement name="email" type="email" label="Email" handleChange={handleChange} value={formData.email} />
							<FormElement
								name="password"
								type="password"
								label="Password"
								handleChange={handleChange}
								value={formData.password}
							/>
						</div>
					</div>
				</div>

				<div className="px-2">
					{/* <input type="checkbox" /> IMPLEMENT AND MANAGE POLICY AGREEMENT and USE OF COOKIES */}
					<button
						type="submit"
						onClick={handleRegister}
						className="rounded-md w-full my-4 bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						Register
					</button>
					<Link className="text-gray-300 hover:text-gray-100" href="/login">
						{"Already have an account? Login!"}
					</Link>
				</div>
			</div>
		</main>
	);
}

export default Register;
