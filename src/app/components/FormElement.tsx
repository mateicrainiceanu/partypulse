import React from "react";
import {formElement} from "@/types";
import {TextField} from "@mui/material";

interface Props {
	name: string;
	type?: string;
	label: string;
	handleChange: (e: any) => void;
	value: string | number;
	noAutoComplete?: boolean;
}

function FormElement({name, type, label, handleChange, value, noAutoComplete}: Props) {
	return (
		<div className="my-2">
			<TextField
				autoComplete={`${noAutoComplete ? false : true}`}
				variant={"filled"}
				label={label}
				name={name}
				type={type ? type : "text"}
				className="w-full bg-white rounded-lg "
				value={value}
				onChange={handleChange}></TextField>
			{/* <label className="" htmlFor={name}>{label}</label>
			<input
				id={name}
				name={name}
				value={value}
				type={type}
                onChange={handleChange}
				className="w-full my-2 h-8 py-4 px-5 text-black rounded-lg text-center"
			/> */}
		</div>
	);
}

export default FormElement;
