import FormBtn from "@/app/components/FormBtn";
import React, {useContext, useEffect, useState} from "react";

import NewLocation from "./NewLocation";
import axios from "axios";
import LocationSmView from "../../_components/LocationSmView";
import FormElement from "@/app/components/FormElement";
import {Pagination} from "@mui/material";
import {AlertContext} from "@/app/AlertContext";
import {LoadManContext} from "@/app/LoadManContext";

function PaLocation({pa}: {pa: boolean}) {
	const [newloc, setNewloc] = useState(false);
	const [locations, setLocations] = useState([]);

	const [pg, setPg] = useState(1);
	const showOnPg = 4;

	const [search, setSearch] = useState("");

	const {handleAxiosError} = useContext(AlertContext);
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);

	useEffect(() => {
		getData();
	}, []);

	async function getData() {
		addLoadingItem();
		await axios
			.get("/api/location" + (pa ? "?onlyManaged=true" : ""))
			.then((response) => {
				setLocations(response.data.locations);
				finishedLoadingItem();
			})
			.catch((error) => {
				handleAxiosError(error);
			});
	}

	return (
		<div>
			<h3 className="font-bold text-xl mt-5 text-center">Locations</h3>
			{pa && (
				<>
					<FormBtn
						name="New"
						onClick={() => {
							setNewloc(true);
						}}></FormBtn>

					{newloc && (
						<NewLocation
							close={() => {
								setNewloc(false);
								getData();
							}}
						/>
					)}
				</>
			)}

			<FormElement
				name="search"
				label="Search"
				value={search}
				handleChange={(e: any) => {
					setSearch(e.target.value);
				}}></FormElement>

			{locations
				.filter((location: {name: string}) => location.name.includes(search))
				.slice((pg - 1) * showOnPg, pg * showOnPg)
				.map((locationdata: any, i) => (
					<LocationSmView
						key={locationdata.id}
						locationData={locationdata}
						showManage={locationdata.userHasRightToManage}
					/>
				))}

			<div className="w-full flex p-2 justify-center">
				<Pagination
					page={pg}
					count={Math.ceil(locations.length / showOnPg)}
					onChange={(_: any, val: number) => {
						setPg(val);
					}}
				/>
			</div>
		</div>
	);
}

export default PaLocation;
