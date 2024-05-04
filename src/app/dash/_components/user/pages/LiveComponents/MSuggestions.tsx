import React, {useState} from "react";
import FormElement from "@/components/FormElement";
import SongPreview, {Song} from "@/components/SongPreview";
import axios from "axios";

function MSuggestions({eventId}: {eventId: number}) {
	const [search, setSearch] = useState("");

	const [results, setResults] = useState([]);

	function updateResults(q: string) {
		axios
			.post("/api/search/song/external", {q})
			.then((res) => {
				setResults(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<div className="w-full">
			<h2 className="text-center font-mono text-xl">Suggest a song</h2>
			<FormElement
				name="search"
				label="Search For Song"
				value={search}
				handleChange={(e: any) => {
					setSearch(e.target.value);
					updateResults(e.target.value);
				}}
			/>
			<div className="max-h-96 overflow-y-scroll">
				{results.map((song: Song, i) => (
					<SongPreview key={i} songData={song} />
				))}
			</div>
		</div>
	);
}

export default MSuggestions;
