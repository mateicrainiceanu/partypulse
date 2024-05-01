import FormBtn from "@/components/FormBtn";
import React, {useEffect, useState} from "react";

import NewLocation from "./NewLocation";
import axios from "axios";
import LocationSmView from "./LocationSmView";

function PaLocation() {
	const [newloc, setNewloc] = useState(false);

	const [locations, setLocations] = useState([]);

	useEffect(() => {
		getData();
	}, []);

	async function getData() {
		await axios
			.get("/api/partner/locations")
			.then((response) => {
				setLocations(response.data.locations);
			})
			.catch((error) => {
				alert("err: " + error);
			});
	}

	return (
		<div>
			<h3 className="font-bold text-xl mt-5">Locations</h3>
			<FormBtn
				name="New"
				onClick={() => {
					setNewloc(true);
				}}></FormBtn>

			{newloc && (
				<NewLocation
					close={() => {
						setNewloc(false);
						getData()
					}}
				/>
			)}

			{locations.map((locationdata: any, i) => (
				<LocationSmView key={i} locationData={locationdata} showManage={true}/>
				
			))}
		</div>
	);
}

export default PaLocation;
