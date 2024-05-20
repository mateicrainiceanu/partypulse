"use client";

import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import {CgAdd} from "react-icons/cg";
import {CgRemove} from "react-icons/cg";
import {BiQr} from "react-icons/bi";
import {AlertContext} from "@/app/AlertContext";
import { LoadManContext } from "@/app/LoadManContext";

function Codes() {
	const [codes, setCodes] = useState([]);
	const {handleAxiosError, handleError} = useContext(AlertContext);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext)

	useEffect(() => {
		addLoadingItem()
		axios
			.get("/api/user/partner/codes")
			.then((res) => {
				setCodes(res.data);
				finishedLoadingItem()
			})
			.catch(handleAxiosError);
	}, []);

	function remove(id: number) {
		addLoadingItem()
		axios
			.delete("/api/code" + "?codeId=" + id)
			.then((res) => {
				setCodes(res.data);
				finishedLoadingItem()
			})
			.catch((err) => {
				handleAxiosError(err);
			});
	}

	function newCode() {
		addLoadingItem()
		axios
			.get("/api/code?usedFor=user")
			.then((res) => {
				setCodes(res.data.codes);
				finishedLoadingItem()
			})
			.catch(handleAxiosError);
	}

	return (
		<div className="my-5 max-w-lg mx-auto">
			<div>
				<h1 className="text-center font-mono font-bold text-xl">Your codes</h1>
				<hr className="my-2" />
				<p>
					Codes are used for users in order to confirm participation at your event. This is how we ensure our privacy
					and most important, your safety.
				</p>
				<hr className="my-2" />

				<table className="w-full ">
					<thead className="h-9 bg-gray-800">
						<tr>
							<td>
								<CgAdd className="text-xl" onClick={newCode} />
							</td>
							<td className="font-mono font-bold">Code</td>
						</tr>
					</thead>
					<tbody>
						{codes.map((code: {code: string; id: number}, i) => (
							<tr key={i} className="h-9">
								<td>
									<div className="flex gap-4">
										<CgRemove
											id={`${code.id}`}
											onClick={() => {
												remove(code.id);
											}}
										/>{" "}
										<BiQr
											onClick={() => {
												window.location.href = "/dash/dj/codes/" + code.code;
											}}
										/>
									</div>
								</td>
								<td>{code.code}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Codes;
