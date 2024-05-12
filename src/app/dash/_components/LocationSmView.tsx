import React, {useContext, useState} from "react";
import {IoHeart, IoSettingsSharp} from "react-icons/io5";
import {BiHeart} from "react-icons/bi";
import axios from "axios";
import { AlertContext } from "@/app/AlertContext";
import { FullLocation } from "@/types";

function LocationSmView({
	locationData,
	showManage,
}: {
	locationData: FullLocation;
	showManage?: boolean;
}) {	
	const [tliked, setTLiked] = useState(locationData.liked);
	const {handleAxiosError} = useContext(AlertContext);

	function handleLike() {
		axios
			.post("/api/location/reaction", {id: locationData.id, liked: !tliked})
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				handleAxiosError(err)
			});
		setTLiked((prev) => !prev);
	}

	return (
		<div className="w-full bg-yellow-400 rounded-lg">
			<div
				className="relative w-full bg-yellow-300 hover:bg-yellow-200 rounded-xl my-2 text-black text-left p-3 "
				onClick={() => {
					window.location.href = "/location/" + locationData.id;
				}}>
				<h3 className="font-bold font-mono">{locationData.name}</h3>
				<p className="italic">{locationData.adress}</p>
				<p className="italic">{locationData.city}</p>
				<div className="mx-auto text-center">
					{showManage && (
						<button
							className="absolute right-2 top-2 border-2 border-gray-500 hover:bg-black hover:border-black text-gray-500 hover:text-white rounded-3xl p-2"
							onClick={(e: any) => {
								e.stopPropagation();
								window.location.href = "/dash/em/manage-location/" + locationData.id;
							}}>
							<IoSettingsSharp className="" />
						</button>
					)}
				</div>
			</div>
			<div className="flex text-3xl p-1 px-3 justify-end">
				<button onClick={handleLike}>
					<IoHeart
						className={!tliked ? "text-gray-800 hover:text-gray-700" : "text-red-500 hover:text-red-400"}
					/>
				</button>
			</div>
		</div>
	);
}

export default LocationSmView;
