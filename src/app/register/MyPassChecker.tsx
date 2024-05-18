import React from "react";
import {passwordStrength} from "check-password-strength";
import {RiLockPasswordFill} from "react-icons/ri";

const passCheckOptions = [
	{
		id: 0,
		value: "Too weak",
		minDiversity: 0,
		minLength: 0,
	},
	{
		id: 1,
		value: "Weak",
		minDiversity: 1,
		minLength: 6,
	},
	{
		id: 2,
		value: "Medium",
		minDiversity: 2,
		minLength: 8,
	},
	{
		id: 3,
		value: "Strong",
		minDiversity: 3,
		minLength: 10,
	},
];

function MyPassChecker({givenPass}: {givenPass: string}) {
	const {strength, id} = checkPassword(givenPass);

	return (
		<div className="flex w-full flex-row justify-center my-1 gap-2">
			<span className="my-auto">{strength}</span>
			<div className="my-auto text-xl">
				{id === 3 && <RiLockPasswordFill className="text-green-400" />}
				{id === 2 && <RiLockPasswordFill className="text-yellow-400" />}
				{id === 1 && <RiLockPasswordFill className="text-pink-400" />}
				{id === 0 && <RiLockPasswordFill className="text-red-400" />}
			</div>
		</div>
	);
}

export function checkPassword(pass: string) {
	const strength = passwordStrength(pass, passCheckOptions as any).value;
	const id = passwordStrength(pass, passCheckOptions as any).id;
	return {strength, id};
}

export default MyPassChecker;
