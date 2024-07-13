import React, {useEffect, useState} from "react";

import {City, Country, State, IState, ICity} from "country-state-city";
import {Autocomplete, TextField, Accordion, AccordionDetails, AccordionSummary, AccordionActions} from "@mui/material";

function CitySelector({
	userLocation,
	setCityString,
	cityString,
}: {
	userLocation?: boolean;
	cityString: string;
	setCityString: (cityStr: string) => void;
}) {
	const [countryField, setCountryField] = useState("");
	const [country, setCountry] = useState(null as any);
	const [states, setStates] = useState([] as IState[]);
	const [stateField, setStateField] = useState("");
	const [state, setState] = useState(null as any);
	const [cities, setCities] = useState([] as ICity[]);
	const [cityField, setCityField] = useState("");
	const [city, setCity] = useState(null as any);
	const [accExp, setAccExp] = useState(false);

	let countries = Country.getAllCountries();

	useEffect(() => {
		if (userLocation) {
			const countryCode = localStorage.getItem("countryCode");
			const stateCode = localStorage.getItem("stateCode");
			const lscity = localStorage.getItem("city");
			if (countryCode && stateCode && lscity) {
				setCountry(Country.getCountryByCode(countryCode));
				setStates(State.getStatesOfCountry(countryCode));
				setState(State.getStateByCodeAndCountry(stateCode, countryCode));
				setCity(City.getCitiesOfState(countryCode, stateCode).find((city) => city.name === lscity) || null);
			} else {
				setAccExp(true);
			}
		}
	}, []);

	useEffect(() => {
		if (state?.isoCode && country.isoCode) setCities(City.getCitiesOfState(country.isoCode, state.isoCode));
		else if (country?.isoCode) {
			setStates(State.getStatesOfCountry(country.isoCode));
			setState(null);
		} else if (!country) {
			setCities([]);
			setStates([]);
		}
	}, [state, country]);

	useEffect(() => {
		if (city && userLocation) {
			localStorage.setItem("countryCode", city.countryCode);
			localStorage.setItem("stateCode", city.stateCode);
			localStorage.setItem("city", city.name);
		}
		if (city) setCityString(country.isoCode + ", " + state.isoCode + ", " + city.name);
	}, [city]);

	return (
		<div>
			<Accordion
				className="bg-opacity-20 bg-slate-300 text-white"
				expanded={accExp}
				onChange={() => {
					setAccExp((prev) => !prev);
				}}>
				<AccordionSummary className="flex">
					<div className="my-auto">
						{userLocation
							? country && city && state
								? country.flag + " " + country.isoCode + ", " + state.isoCode + ", " + city.name
								: "Please select city"
							: cityField
							? cityField
							: "Please select city"}
					</div>
					<AccordionActions className="ms-auto">
						{country && city && state ? (
							<button
								onClick={() => {
									setState(null);
									setCountry(null);
									setCity(null);
								}}>
								Change
							</button>
						) : (
							<button>Add Location</button>
						)}
					</AccordionActions>
				</AccordionSummary>
				<AccordionDetails>
					<div className="w-full flex flex-col gap-2">
						<Autocomplete
							className="bg-white rounded-lg "
							options={countries}
							getOptionLabel={(opt) => opt.flag + " " + opt.name}
							onChange={(_: any, val) => {
								setCountry(val);
							}}
							renderInput={(params) => (
								<TextField
									autoComplete="false"
									{...params}
									variant="filled"
									label="Country"
									onChange={(e: any) => {
										setCountryField(e.target.value);
									}}
									value={countryField}
								/>
							)}></Autocomplete>
						<Autocomplete
							className="bg-white rounded-lg "
							disabled={!country}
							options={states}
							getOptionLabel={(opt) => opt.name}
							onChange={(_: any, val) => {
								setState(val);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant="filled"
									autoComplete="false"
									label="State"
									onChange={(e: any) => {
										setStateField(e.target.value);
									}}
									value={stateField}
								/>
							)}></Autocomplete>
						<Autocomplete
							disabled={!(country && state)}
							className="bg-white rounded-lg "
							options={cities}
							getOptionLabel={(opt) => opt.name}
							onChange={(_: any, val) => {
								setCity(val);
								setAccExp(false);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant="filled"
									label="City"
									autoComplete="false"
									onChange={(e: any) => {
										setCityField(e.target.value);
									}}
									value={cityField}
								/>
							)}></Autocomplete>
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}

export default CitySelector;
