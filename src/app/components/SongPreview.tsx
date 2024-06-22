import React, {useEffect, useRef, useState} from "react";
import {FaPlayCircle, FaPauseCircle} from "react-icons/fa";
import {SongRequest} from "../dash/dj/event/[id]/LiveEventUpdates";
export interface Song {
	id: number;
	title: String;
	artists: String;
	imgsrc: string;
	preview: string;
	requests:Array<string>
}

function SongPreview({
	songData,
	start,
	djView,
}: {
	songData: Song | SongRequest;
	start?: (id: number) => void;
	djView?: boolean;
}) {
	const audioRef = useRef(null as any);

	const [playStatus, setPlayStatus] = useState(false);

	return (
		<div
			className={"w-full flex  " + (djView ? "px-3" : "p-3 my-2 hover:bg-gray-800")}
			onClick={() => {
				if (start) start(songData.id);
			}}>
			<img src={songData.imgsrc} alt="Album cover" width={50} height={50}></img>
			<span className="my-auto mx-5">{songData.title + " - " + songData.artists}</span>
			{djView && (
				<div className="my-auto ms-auto text-3xl flex items-center justify-center gap-2">
					<span className="text-lg">{songData.requests.length}</span>

					<button
						className="my-auto"
						onClick={() => {
							setPlayStatus((prev) => !prev);
							if (playStatus) audioRef.current.pause();
							else audioRef.current.play();
						}}>
						{!playStatus ? (
							<FaPlayCircle className="hover:text-gray-400" />
						) : (
							<FaPauseCircle className={playStatus ? "text-red-400" : ""} />
						)}
					</button>
					<audio ref={audioRef} src={songData.preview}></audio>
				</div>
			)}
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
