import React, {useContext, useState} from "react";
import FormElement from "@/app/components/FormElement";
import FormBtn from "@/app/components/FormBtn";
import Map from "@/app/components/Map";
import axios from "axios";
import {IoMdCloseCircle} from "react-icons/io";
import {AlertContext} from "@/app/AlertContext";
import CitySelector from "@/app/components/CitySelector";

interface IProps {
	close: () => void;
}

function NewLocation({close}: IProps) {
	const [locData, setLocData] = useState({name: "", useForAdress: "", adress: "", city: "", lon: 0.0, lat: 0.0});
	const [selected, setSelected] = useState("coordinates");

	const {handleAxiosError} = useContext(AlertContext);

	function handleChange(e: any) {
		setLocData((prev) => ({...prev, [e.target.name]: e.target.value}));
	}

	function retrivePosition() {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocData((prev) => ({...prev, lat: position.coords.latitude, lon: position.coords.longitude}));
			},
			() => {
				alert("There was an error retriveing your location!");
			}
		);
	}

	async function handleSubmit() {
		await axios
			.post("/api/location", {...locData, useForAdress: selected})
			.then((data) => {
				close();
			})
			.catch((error) => {
				handleAxiosError(error);
				close();
			});
	}

	return (
		<div>
			<div className="fixed inset-10 sm:inset-y-40 sm:inset-x-20 rounded-2xl bg-slate-700 p-5 overflow-y-scroll z-10">
				<button className="absolute right-5 top-5 text-2xl" onClick={close}>
					<IoMdCloseCircle />
				</button>
				<div className="max-w-lg mx-auto ">
					<h3 className="font-bold text-xl mt-2">New Location</h3>
					<hr className="my-2" />
					<FormElement
						label="Name"
						type="text"
						name="name"
						value={locData.name}
						handleChange={handleChange}></FormElement>
					<FormElement
						label="Adress"
						type="text"
						name="adress"
						value={locData.adress}
						handleChange={handleChange}></FormElement>
					<CitySelector
						cityString={locData.city}
						setCityString={(newCity) => {
							setLocData((prev) => ({...prev, city: newCity}));
						}}
					/>

					<h4 className="my-2 font-bold">GPS Location</h4>
					<p className="italic text-xs">
						You can always update / fill these once you are at the location. We recommend that you auto-fill.
					</p>
					<div>
						<div className="w-full text-left my-2">
							<button
								className={
									"mx-1 mt-2 py-2 px-4 rounded-t-lg bg-gray-500 hover:bg-gray-600 " +
									(selected === "coordinates" ? "sel" : "")
								}
								name="coordinates"
								onClick={(e: any) => {
									setSelected(e.target.name);
								}}>
								Coorinates
							</button>
							<button
								className={
									"mx-1 mt-2 py-2 px-4 rounded-t-lg bg-gray-500 hover:bg-gray-600 " +
									(selected === "adress" ? "sel" : "")
								}
								name="adress"
								onClick={(e: any) => {
									setSelected(e.target.name);
								}}>
								Adress
							</button>
							<button
								className={
									"mx-1 mt-2 py-2 px-4 rounded-t-lg bg-gray-500 hover:bg-gray-600 " +
									(selected === "locname" ? "sel" : "")
								}
								name="locname"
								onClick={(e: any) => {
									setSelected(e.target.name);
								}}>
								Name
							</button>

							<hr className="text-white" />
						</div>
					</div>

					{selected === "coordinates" && (
						<div>
							<button className="bg-purple-400 hover:bg-purple-500 m-2 py-1 px-2 rounded-lg" onClick={retrivePosition}>
								Get Location
							</button>

							<div className="flex my-2">
								<div className="w-1/2 pr-2">
									<label htmlFor="lon">Longitude</label>
									<input
										id="lon"
										name="lon"
										type="number"
										className="w-full p-1 my-2 rounded-lg text-black"
										onChange={handleChange}
										value={locData.lon}
									/>
								</div>
								<div className="w-1/2 pr-2">
									<label htmlFor="lat">Latitude</label>
									<input
										id="lat"
										name="lat"
										type="number"
										className="w-full p-1 my-2 rounded-lg text-black"
										onChange={handleChange}
										value={locData.lat}
									/>
								</div>
							</div>
							{locData.lat != 0 && locData.lon != 0 && <Map q={`${locData.lat},${locData.lon}`} />}
						</div>
					)}
					{selected === "adress" && (
						<div>
							<FormElement
								name="adress"
								type="text"
								label="Adress"
								value={locData.adress}
								handleChange={handleChange}></FormElement>
							{locData.adress !== "" && <Map q={locData.adress + "," + locData.city} />}
						</div>
					)}
					{selected === "locname" && (
						<div>
							<p className="italic text-xs">Use a current google maps indexed location based on the name.</p>
							<FormElement
								name="name"
								type="text"
								label="Loaction Name"
								value={locData.name}
								handleChange={handleChange}></FormElement>
							{locData.name !== "" && <Map q={locData.name + "," + locData.city} />}
						</div>
					)}
					<FormBtn name="Submit" onClick={handleSubmit}></FormBtn>
				</div>
			</div>
		</div>
	);
}

export default NewLocation;
