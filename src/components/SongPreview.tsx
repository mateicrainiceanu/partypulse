import React from "react";

export interface Song {
	id: string;
	title: String;
	artists: String;
	imgsrc: string;
}

function SongPreview({songData, start, djView}: {songData: Song; start?: (id: string) => void; djView?: boolean}) {
	return (
		<div
			className={"w-full flex hover:bg-gray-800 " + (djView ? "px-3" : "p-3 my-2")}
			onClick={() => {
				if (start) {
					start(songData.id);
				}
			}}>
			<img src={songData.imgsrc} alt="Album cover" width={50} height={50}></img>
			<span className="my-auto mx-5">{songData.title + " - " + songData.artists}</span>
		</div>
	);
}

export function SongLgPreview({songData}: {songData: Song}) {
	return (
		<div className="w-full my-2 p-3">
			<div className="w-full">
				<img src={songData.imgsrc} alt="Album cover" width={200} height={200} className="mx-auto"></img>
			</div>
			<h4 className="my-3 text-center mx-auto font-mono text-bold">{songData.title + " - " + songData.artists}</h4>
		</div>
	);
}

export default SongPreview;
