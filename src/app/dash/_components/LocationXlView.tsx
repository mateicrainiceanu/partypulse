import React from "react";
import {BsGeoAltFill} from "react-icons/bs";
import {BsHousesFill} from "react-icons/bs";
import Map from "@/app/components/Map";

function LocationXlView({
	data,
}: {
	data: {id: number; name: string; useForAdress: string; adress: string; city?: string; lon?: Number; lat?: number};
}) {	
	return (
		<div className="w-max-xl my-2">
			<div className="rounded-xl bg-yellow-300 p-2 text-black font-mono">
				<h3 className="font-bold text-center text-xl">{data.name}</h3>
				<hr className="border-black my-2" />
				<div className="text-left">
					{data.adress && (
						<div className="flex">
							<BsGeoAltFill className="m-1" />
							<p className=""> {" " + data.adress}</p>
						</div>
					)}
					{data.city && (
						<div className="flex">
							<BsHousesFill className="m-1" />
							<p className=""> {" " + data.city}</p>
						</div>
					)}
				</div>
				<hr className="border-black my-2" />
				{data.useForAdress === "adress" && <Map q={data.adress + " ," + data.city} />}
				{data.useForAdress === "coordinates" && <Map q={data.lat + "," + data.lon} />}
				{data.useForAdress === "locname" && <Map q={data.name + "," + data.city} />}
			</div>
		</div>
	);
}

export default LocationXlView;
