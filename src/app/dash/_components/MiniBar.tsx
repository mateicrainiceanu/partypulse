import {useState, useContext} from "react";
import React from "react";
import "./dash.css";
import {UserContext} from "../../UserContext";
import { LoadManContext } from "@/app/LoadManContext";

interface IProps {
	fselected: string;
}

function MiniBar({fselected}: IProps) {
	const [selected, setSelected] = useState(fselected);
	const {user} = useContext(UserContext);	
	
	return (
		<div>
			<div className="w-full">
				{SelectBtn("user", selected, setSelected)}
				{SelectBtn("em", selected, setSelected)}
				{SelectBtn("dj", selected, setSelected)}

				<span className="mx-2">{user.uname}</span>

				<hr className="text-white" />
			</div>
		</div>
	);
}

export default MiniBar;

function SelectBtn(name: string, selected: string, setSelected: React.Dispatch<React.SetStateAction<string>>) {
	const {addLoadingItem} = useContext(LoadManContext)

	return (
		<button
			name={name}
			className={
				"mx-1 mt-2 py-2 px-4 rounded-t-lg bg-gray-500 hover:bg-gray-600 uppercase " + (selected === name ? "sel" : "")
			}
			onClick={(e: any) => {
				addLoadingItem();
				setSelected(e.target.name);
				window.location.replace(name === "user" ? "/dash" : "/dash/" + name);
			}}>
			{name}
		</button>
	);
}

export {SelectBtn}
