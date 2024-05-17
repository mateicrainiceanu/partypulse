import React, {useContext, useState} from "react";
import FormElement from "@/app/components/FormElement";
import SongPreview, {Song, SongLgPreview} from "@/app/components/SongPreview";
import axios from "axios";
import {IoMdCloseCircle} from "react-icons/io";
import FormBtn from "@/app/components/FormBtn";
import {AlertContext} from "@/app/AlertContext";
import {FullEvent} from "@/types";

function MSuggestions({eventId, setEvent}: {eventId: number; setEvent: (event: FullEvent) => void}) {
	const [search, setSearch] = useState("");

	const [results, setResults] = useState([]);

	const [suggest, setSuggest] = useState(null);

	const {handleAxiosError, handleError} = useContext(AlertContext);

	function updateResults(q: string) {
		axios
			.post("/api/search/song/external", {q})
			.then((res) => {
				setResults(res.data);
			})
			.catch((err) => {
				handleAxiosError(err);
			});
	}

	function suggestionStart(id: string) {
		setSuggest(results.filter((song: Song) => song.id == id)[0]);
	}

	function handleSubmit() {
		axios
			.post("/api/user/request", {song: suggest})
			.then((res) => {
				///handle succes
				setEvent(res.data);
				handleError("Sent to DJ!", "success");
				setSuggest(null);
			})
			.catch(handleAxiosError);
	}

	return (
		<div className="w-full">
			<h2 className="text-center font-mono text-xl">Suggest a song</h2>
			<FormElement
				noAutoComplete
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
					<SongPreview key={i} songData={song} start={suggestionStart} />
				))}
			</div>

			{suggest != null && (
				<div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center z-9">
					<div className="relative rounded-2xl bg-slate-700 p-5 z-10">
						<button
							className="absolute right-5 top-5 text-2xl"
							onClick={() => {
								setSuggest(null);
							}}>
							<IoMdCloseCircle />
						</button>
						<h1 className="text-center font-mono text-xl">Are you sure?</h1>
						<div className="w-full">
							<SongLgPreview songData={suggest} />
						</div>

						<FormBtn name="Submit to DJ" onClick={handleSubmit}></FormBtn>
					</div>{" "}
				</div>
			)}
		</div>
	);
}

export default MSuggestions;
