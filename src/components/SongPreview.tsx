import React from "react";
import Image from "next/image";

export interface Song {name: String; artists: String; image: {url: string}}

function SongPreview({songData}: {songData: Song}) {
	return (
		<div className="w-full flex my-2 hover:bg-gray-800">
			<img src={songData.image.url} alt="Album cover" width={50} height={50}></img>
			<span className="my-auto mx-5">{songData.name + " - " + songData.artists}</span>
		</div>
	);
}

export default SongPreview;
