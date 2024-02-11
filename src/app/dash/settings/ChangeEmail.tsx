"use client";
import React, {useState} from "react";
import FormElement from "@/components/FormElement";
import FormBtn from "@/components/FormBtn";

function ChangeEmail() {
	const [email, setEmail] = useState("");

    async function handle(e: any){

    }

	return (
		<>
			<FormElement
				label="New Email"
				name="email"
				type="email"
				value={email}
				handleChange={(e) => {
					setEmail(e.target.value);
				}}/>
            <FormBtn name="Get Verifiaction Email" onClick={handle}/>
		</>
	);
}

export default ChangeEmail;
