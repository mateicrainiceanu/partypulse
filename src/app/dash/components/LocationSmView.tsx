import React from "react";
import {IoSettingsSharp} from "react-icons/io5";

function LocationSmView({locationData, showManage}: {locationData: {name:string, id:number, adress:string}, showManage?: boolean}) {
	return (
		<div
			className=" relative w-full bg-yellow-300 hover:bg-yellow-200 rounded-xl my-2 text-black text-left p-3 "
			onClick={() => {}}>
			<h3 className="font-bold font-mono">{locationData.name}</h3>
			<p className="italic">{locationData.adress}</p>
			<div className="mx-auto text-center">
				{showManage && (
					<button
						className="absolute right-2 top-2 border-2 border-gray-500 hover:bg-black hover:border-black text-gray-500 hover:text-white rounded-3xl p-2"
						onClick={() => {
							window.location.href = "/dash/em/manage-location/" + locationData.id;
						}}>
						<IoSettingsSharp className=""/>
					</button>
				)}
			</div>
		</div>
	);
}

export default LocationSmView;
