"use client";
import {ChangePassword} from "./ChangePassword";
import React from "react";
import ChangeEmail from "./ChangeEmail";
import FormBtn from "@/app/components/FormBtn";
import Link from "next/link";
import ChangeProfile from "./ChangeProfile";
import ChangeNotifications from "./ChangeNotifications";

export default function Settings() {
	return (
		<div>
			<div className="items-center mx-auto flex-col justify-center p-10 max-w-xl">
				<h1 className="text-2xl text-center mt-2 mb-1 font-mono">Settings</h1>
				<ChangePassword />
				{/* <h2 className="text-xl text-center mt-2 mb-1 font-mono text-violet-300">Change email</h2>
				<ChangeEmail></ChangeEmail> */}
				<hr className="my-2"/>
				<ChangeNotifications />
				<hr className="my-2"/>
				<h2 className="text-xl text-center mt-2 mb-1 font-mono text-violet-300">Profile</h2>
				<ChangeProfile />
				<hr className="my-5" />
				<div className="py-10">
					<h3 className="text-xl text-center mt-2 mb-1 font-mono text-violet-300">Become a Partner</h3>
					<FormBtn
						onClick={() => {
							window.location.href = "/dash/become-an-em";
						}}
						name="Event Manager"></FormBtn>
					<FormBtn
						onClick={() => {
							window.location.href = "/dash/become-a-dj";
						}}
						name="DJ"></FormBtn>
					<p className="text-center">DJs have automactically rights to manage events</p>
				</div>
			</div>
		</div>
	);
}