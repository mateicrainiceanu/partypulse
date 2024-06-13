"use client";
import {AlertContext} from "@/app/AlertContext";
import FormElement from "@/app/components/FormElement";
import {TextField} from "@mui/material";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";

function GenreVote({eventId}: {eventId: number}) {
	const [genres, setGenres] = useState([]);
	const [selected, setSelected] = useState(0);
	const [search, setSearch] = useState("");
	const {handleAxiosError} = useContext(AlertContext);

	useEffect(() => {
		axios
			.get("/api/genre")
			.then((res) => {
				setGenres(res.data);
			})
			.catch(handleAxiosError);
	}, []);

	useEffect(() => {
		if (selected) axios.post("/api/genre/vote", {evId: eventId, genreId: selected});
	}, [selected]);

	return (
		<div className="w-full">
			<h2 className="text-center font-mono text-xl">Genre Vote</h2>
			<FormElement
				noAutoComplete
				name="search"
				label="Search For Genre"
				value={search}
				handleChange={(e: any) => {
					setSearch(e.target.value);
				}}
			/>
			<div className="flex gap-5 font-mono flex-row flex-wrap justify-center my-4 select-none">
				{genres
					.filter(({name}: {name: string}) => name.includes(search))
					.map((genre: {name: string; id: number}) => (
						<div
							key={genre.id}
							onClick={() => {
								setSelected(genre.id);
							}}
							className={`py-3 px-5 ${selected === genre.id ? "bg-yellow-400 text-black" : "bg-gray-500"} rounded-full`}>
							{genre.name}
						</div>
					))}
			</div>
		</div>
	);
}

export default GenreVote;
