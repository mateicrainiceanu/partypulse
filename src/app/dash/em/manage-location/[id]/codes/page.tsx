"use client";

import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import {CgAdd} from "react-icons/cg";
import {CgRemove} from "react-icons/cg";
import {BsQrCode} from "react-icons/bs";
import {BiQr} from "react-icons/bi";

import {useQRCode} from "next-qrcode";
import {AlertContext} from "@/app/AlertContext";

function Codes({params} : {params: {id: number}}) {
	const [codes, setCodes] = useState([]);
	const {handleAxiosError} = useContext(AlertContext);

	const {Canvas} = useQRCode();

	useEffect(() => {
		axios
			.get("/api/location/" + params.id + "/codes")
			.then((res) => {
				setCodes(res.data);
			})
			.catch((err) => {
				handleAxiosError(err);
			});
	}, []);

	function remove(id: number) {
		axios
			.delete("/api/code" + "?codeId=" + id)
			.then((res) => {
				setCodes(res.data);
			})
			.catch((err) => {
				handleAxiosError(err);
			});
	}

	function newCode() {
		axios
			.get("/api/code?usedFor=location&locid=" + params.id)
			.then((res) => {
				setCodes(res.data.codes);
			})
			.catch((err) => {
				handleAxiosError(err);
			});
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
												window.location.href = "/dash/em/manage-location/"+ params.id + "/codes/" + code.code;
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
