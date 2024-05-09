"use client";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import LocationSmView from "@/app/dash/_components/LocationSmView";
import FormElement from "@/components/FormElement";
import FormBtn from "@/components/FormBtn";
import Map from "@/components/Map";
import {LoadingContext} from "@/app/LoadingContext";
import AddUser from "./AddUser";
import EditUsers from "./EditUsers";
import {AlertContext} from "@/app/AlertContext";

function ManageLocation({params}: {params: {id: string}}) {
	const locationid = params.id;
	const setLoading = useContext(LoadingContext);
	const {handleAxiosError} = useContext(AlertContext);

	const [locationData, setLocationData] = useState({
		id: 0,
		name: "",
		useForAdress: "",
		city: "",
		adress: "",
		lat: 0.0,
		lon: 0.0,
	});

	useEffect(() => {
		getData();
	}, []);

	async function getData() {
		await axios.get("/api/location/" + locationid).then((response) => {
			setLocationData(response.data);
		});
	}

	function retrivePosition() {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocationData((prev) => ({...prev, lat: position.coords.latitude, lon: position.coords.longitude}));
			},
			() => {
				alert("There was an error retriveing your location!");
			}
		);
	}

	function handleChange(e: any) {
		setLocationData((prev) => ({...prev, [e.target.name]: e.target.value}));
	}

	async function handleSave() {
		setLoading(true);

		await axios
			.patch("/api/partner/locations", locationData)
			.then((response) => {
				setLoading(false);
				alert("ok");
				window.location.replace("/dash/em");
			})
			.catch((error) => {
				setLoading(false);
				handleAxiosError(error);
			});
	}

	return (
		<div className="container mx-auto">
			<h1 className="text-3xl font-mono font-bold text-center">Manage location</h1>
			<div className="max-w-lg mx-auto my-2">
				<h2 className="text-lg font-bold">Preview</h2>
				<LocationSmView
					locationData={{id: locationData.id, name: locationData.name, adress: locationData.adress}}></LocationSmView>
			</div>
			<div className="flex my-4 flex-wrap">
				<h1 className="text-2xl font-mono font-bold text-center w-full">Edit data</h1>
				<div className="w-full lg:w-1/2 p-5">
					<div className="w-full">
						<FormElement label="Name" type="text" name="name" value={locationData.name} handleChange={handleChange} />
						<FormElement
							label="Adress"
							type="text"
							name="adress"
							value={locationData.adress}
							handleChange={handleChange}
						/>
						<FormElement label="City" type="text" name="city" value={locationData.city} handleChange={handleChange} />
						<div>
							<button
								className="bg-purple-500 hover:bg-purple-600 my-2 mt-5 py-1 px-2 rounded-lg w-full"
								onClick={retrivePosition}>
								Get Location For Coodinates
							</button>
						</div>
						<FormElement label="Lon" type="number" name="lon" value={locationData.lon} handleChange={handleChange} />
						<FormElement label="Lat" type="number" name="lat" value={locationData.lat} handleChange={handleChange} />
					</div>
				</div>
				<div className="w-full lg:w-1/2 p-5">
					<div className="w-full">
						<h4 className="text-lg my-1">Use for the location ...</h4>
						<select
							name="useForAdress"
							className="w-full p-2 my-1 rounded-lg bg-slate-600"
							value={locationData.useForAdress}
							onChange={handleChange}>
							<option value="adress">Adress</option>
							<option value="coordinates">Coordinates</option>
							<option value="locname">Location Name</option>
						</select>
						<h4 className="text-center text-xl my-2 font-mono">Preview</h4>
						{locationData.useForAdress === "adress" && <Map q={locationData.adress + " ," + locationData.city} />}
						{locationData.useForAdress === "coordinates" && <Map q={locationData.lat + "," + locationData.lon} />}
						{locationData.useForAdress === "locname" && <Map q={locationData.name + "," + locationData.city} />}
					</div>
				</div>
				<div className="w-full">
					<h1 className="text-center font-bold font-mono text-xl">Manage users</h1>
					<p className="italic font-mono text-sm text-center">
						See and edit the managers that have admin rights to this location.
					</p>
					<div className="flex flex-wrap my-4">
						<div className="w-full lg:w-1/2 p-5">
							<h2 className="text-lg font-mono text-center">Add users</h2>
							<AddUser id={params.id}></AddUser>
						</div>
						<div className="w-full lg:w-1/2 p-5">
							<h2 className="text-lg font-mono text-center">Edit users</h2>
							<EditUsers id={params.id}></EditUsers>
						</div>
					</div>
				</div>
			</div>
			<FormBtn name="Save changes" onClick={handleSave} />
		</div>
	);
}

export default ManageLocation;
