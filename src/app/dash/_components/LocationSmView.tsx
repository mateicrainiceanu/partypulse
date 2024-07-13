import React, {useContext, useState} from "react";
import {IoHeart, IoSettingsSharp} from "react-icons/io5";
import {BiHeart} from "react-icons/bi";
import axios from "axios";
import {AlertContext} from "@/app/AlertContext";
import {FullLocation} from "@/types";
import {MdQrCode} from "react-icons/md";

function LocationSmView({locationData, showManage}: {locationData: FullLocation; showManage?: boolean}) {
	const [tliked, setTLiked] = useState(locationData.liked);
	const {handleAxiosError} = useContext(AlertContext);

	function handleLike() {
		axios
			.post("/api/location/reaction", {id: locationData.id, liked: !tliked})
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				handleAxiosError(err);
			});
		setTLiked((prev) => !prev);
	}

	return (
		<div className="w-full dark:bg-purple-300 dark:bg-opacity-40 bg-blue-300 bg-opacity-25 rounded-lg ">
			<div
				className="relative w-full bg-blue-300 bg-opacity-25 dark:bg-purple-300 dark:bg-opacity-20 rounded-xl my-2 text-gray-200 text-left p-3 "
				onClick={() => {
					window.location.href = "/location/" + locationData.id;
				}}>
				<div className="flex">
					<h3 className="font-bold font-mono">{locationData.name}</h3>
					{showManage && (
						<div className="flex gap-2 ms-auto">
							<button
								onClick={(e: any) => {
									e.stopPropagation();
									window.location.href = "/dash/em/manage-location/" + locationData.id + "/codes";
								}}>
								<MdQrCode size={20} />
							</button>
							<button
								className="border-2 border-gray-200 hover:bg-black hover:border-black text-gray-200 hover:text-white rounded-3xl p-2"
								onClick={(e: any) => {
									e.stopPropagation();
									window.location.href = "/dash/em/manage-location/" + locationData.id;
								}}>
								<IoSettingsSharp className="" />
							</button>
						</div>
					)}
				</div>
				<p className="italic">{locationData.adress}</p>
				<p className="italic">{locationData.city}</p>
				<div className="mx-auto text-center"></div>
			</div>
			<div className="flex text-3xl p-1 px-3 justify-end">
				<button onClick={handleLike}>
					<IoHeart className={!tliked ? "text-gray-300 hover:text-gray-500" : "text-red-500 hover:text-red-400"} />
				</button>
			</div>
		</div>
	);
}

export default LocationSmView;
