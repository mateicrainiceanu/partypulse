import { ChangePassword } from './ChangePassword';
import React from "react";
import FormElement from "@/components/FormElement";
import ChangeEmail from './ChangeEmail';

export default function Settings() {
	return (
		<div>
			<div className="items-center mx-auto flex-col justify-center p-10 max-w-xl">
				<h1 className="text-2xl text-center mt-2 mb-1 font-mono">Settings</h1>
				<ChangePassword />
				<h2 className="text-xl text-center mt-2 mb-1 font-mono text-violet-300">Change email</h2>
				<ChangeEmail></ChangeEmail>
				<h2 className="text-xl text-center mt-2 mb-1 font-mono text-violet-300">Profile</h2>
				<h3 className="text-xl text-center mt-2 mb-1 font-mono text-violet-300">City</h3>
				<h3 className="text-xl text-center mt-2 mb-1 font-mono text-violet-300">Become a DJ</h3>
			</div>
		</div>
	);
}

//TODO: implement backend integration
//email verification
//MAYBE: GOOGLE AND APPLE AUTH
