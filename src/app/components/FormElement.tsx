import React, {useContext} from "react";
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
				color="secondary"
				label={label}
				name={name}
				type={type ? type : "text"}
				className="w-full bg-white rounded-lg "
				value={value}
				onChange={handleChange}></TextField>
		</div>
	);
}

export default FormElement;
