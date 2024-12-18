import React, {useEffect, useState} from "react";
import {Switch, Autocomplete, TextField} from "@mui/material";
import axios from "axios";
import FormElement from "@/app/components/FormElement";
import CitySelector from "@/app/components/CitySelector";

export function LocationSelector({eventData, setEventData}: any) {
	const [locationSearch, setLocationSearch] = useState("");
	const [options, setOptions] = useState([]);

	useEffect(handleUpdatePublicLocation, [locationSearch]);

	function handleUpdatePublicLocation() {
		if (locationSearch !== "")
			axios.post("/api/search", {category: "locations", searchQuery: locationSearch}).then((res) => {
				setOptions(res.data.results.map((loc: {id: Number; name: string}) => ({...loc, label: loc.name})));
			});
	}

	function handleChange(e: any) {
		setEventData((prev: any) => ({...prev, [e.target.name]: e.target.value}));
	}

	return (
		<>
			<div>
				<span>Custom location</span>
				<Switch
					value={eventData.customLoc}
					onClick={() => {
						setEventData((prevData: any) => ({...prevData, customLoc: !prevData.customLoc}));
					}}></Switch>
			</div>
			{eventData.customLoc ? (
				<div>
					<FormElement name="locName" label="Name" value={eventData.locName} handleChange={handleChange} />
					<FormElement name="locAdress" label="Adress" value={eventData.locAdress} handleChange={handleChange} />
					<CitySelector
						cityString={eventData.locCity}
						setCityString={(city) => {
							setEventData((prev: any) => ({...prev, locCity: city}));
						}}
					/>
				</div>
			) : (
				<Autocomplete
					className="bg-white rounded-lg"
					options={options}
					onChange={(e: any) => {
						const idx = e.target.dataset.optionIndex;
						const id = (options[idx] as {name: string; label: string; id: number}).id;
						setEventData((prev: any) => ({...prev, locName: e.target.innerText, locId: id}));
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="filled"
							label="Public Location Name"
							value={locationSearch}
							onChange={(e: any) => {
								setLocationSearch(e.target.value);
							}}
						/>
					)}></Autocomplete>
			)}
		</>
	);
}
