"use client";
import FormElement from "@/app/components/FormElement";
import axios from "axios";
import Link from "next/link";
import React, {useContext, useState} from "react";
import {UserContext} from "../UserContext";
import {LoadingContext} from "../LoadingContext";
import {AlertContext} from "../AlertContext";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
import {checkPassword} from "./MyPassChecker";
import MyPassChecker from "./MyPassChecker";
import {signIn} from "next-auth/react";
import {BsGoogle} from "react-icons/bs";
import {BsSpotify} from "react-icons/bs";
import {LoadManContext} from "../LoadManContext";

function Register() {
	const [formData, setFormData] = useState({fname: "", lname: "", uname: "", email: "", password: ""});
	const [avalabile, setAvalabile] = useState(false);
	const {addLoadingItem} = useContext(LoadManContext);
	const [passStrength, setPassStrength] = useState();

	const {user, setUser} = useContext(UserContext);
	const {handleAxiosError, dialogToUser} = useContext(AlertContext);

	async function handleChange(e: any) {
		if (e.target.name === "uname") {
			const username = e.target.value.replaceAll(" ", "");
			axios
				.post("/api/user/username-check", {username: username})
				.then((_) => {
					setAvalabile(true);
				})
				.catch((_) => {
					setAvalabile(false);
				});
		}
		setFormData((prevData) => ({...prevData, [e.target.name]: e.target.value}));
	}

	function handleRegister() {
		if (checkPassword(formData.password).id < 1) {
			dialogToUser({
				title: "Password is to weak!",
				content:
					"In order to ensure our users safety, the passwords used on our platform should be at least at a medium safety-level. That means that the password should contain at least 8 uppercase and lowercase letters and symbols. If you struggle with password management, there always is the option to sing in with Google or Spotify.",
			});
			return;
		}

		if (!avalabile) {
			dialogToUser({
				title: "Unavalabile usename",
				content:
					"In order to ensure our users experience, the usernames on our platform should be unique. Please choose another username and check the below avalability checker if the username is avalabile.",
			});
			return;
		}

		addLoadingItem();

		axios
			.post("/api/user/register", formData)
			.then((response) => {
				const {newuser, id, token} = response.data;
				setUser({...newuser, logged: true, id: id, token: token});
				window.location.replace("/dash/verify");
			})
			.catch(handleAxiosError);
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
							<MyPassChecker givenPass={formData.password} />
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
					<button
						onClick={() => {
							signIn("google").then(() => {
								window.location.replace("/dash");
							});
						}}
						type="submit"
						className="rounded-md w-full mb-2 px-3 py-2 text-sm bg-white hover:bg-gray-300 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						<div className="flex gap-2 justify-center text-black">
							<BsGoogle className="my-auto" /> <span className="my-auto">Sign up with Google</span>
						</div>
					</button>
					<button
						onClick={() => {
							signIn("spotify").then((e) => {
								window.location.replace("/dash");
							});
						}}
						type="submit"
						className="rounded-md w-full mb-2 px-3 py-2 text-sm bg-white hover:bg-gray-300 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						<div className="flex gap-2 justify-center text-black">
							<BsSpotify className="my-auto" /> <span className="my-auto">Sign up with Spotify</span>
						</div>
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
