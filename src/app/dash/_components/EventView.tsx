import React, {useContext, useState} from "react";
import Link from "next/link";
import moment from "moment";

import {MdDateRange} from "react-icons/md";
import {CiLocationOn} from "react-icons/ci";
import {FaHeadphones} from "react-icons/fa6";
import {IoSettingsSharp} from "react-icons/io5";
import {BsCircleFill} from "react-icons/bs";
import {UserContext} from "@/app/UserContext";

import {FaHeart, FaHandFist, FaHandPeace} from "react-icons/fa6";
import {CgMoreVertical} from "react-icons/cg";
import axios from "axios";

function EventView({
	id,
	name,
	date,
	location,
	djs,
	showManage,
	status,
	there,
	coming,
	liked,
}: {
	id: number;
	name: string;
	date: string;
	location: string;
	djs: Array<string>;
	showManage: boolean;
	status: number;
	there: boolean;
	coming: boolean;
	liked: boolean;
}) {
	const {user} = useContext(UserContext);

	const [tliked, setTLiked] = useState(liked);
	const [tcoming, setTComing] = useState(coming);

	var str = "";
	djs.map((dj) => {
		str += dj + ", ";
	});

	function djable() {
		var djable = false;
		djs.map((dj) => {
			if (dj === user.uname) djable = true;
		});

		return djable;
	}

	function reacted(name: string, value: boolean) {
		axios.post("/api/event/reaction", {eventId: id, name: name === "like" ? 5 : 4, value: value}).then((res) => {
			console.log(res);
		});
	}

	return (
		<div className="w-full rounded-xl bg-gray-900 dark:bg-fuchsia-800 dark:bg-opacity-20 bg-opacity-20 dark:text-gray-100 my-2">
			<div
				className=" bg-gray-900 bg-opacity-20 dark:bg-fuchsia-800 dark:bg-opacity-20 hover:bg-opacity-30 text-left p-4 rounded-t-xl "
				onClick={() => {
					window.location.href = "/event/" + id;
				}}>
				{/* TOP BAR */}
				<div className="flex w-full">
					{status === 1 && (
						<div className="my-auto mr-2 text-green-500">
							<BsCircleFill></BsCircleFill>
						</div>
					)}

					{status === 2 && (
						<div className="my-auto mr-2 text-red-500 flex">
							<BsCircleFill></BsCircleFill>
						</div>
					)}
					<h5 className="text-center font-bold text-lg font-mono my-auto">{name}</h5>
					<div className="ms-auto my-auto flex">
						{djable() && (
							<button
								className="relative mx-1 border-2 border-fuchsia-500 hover:bg-fuchsia-500 hover:border-fuchsia-500 text-gray-500 hover:text-white rounded-3xl p-2"
								onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
									e.stopPropagation();
									window.location.href = "/dash/dj/event/" + id;
								}}>
								<FaHeadphones className="" />
							</button>
						)}
						{showManage && (
							<button
								className="relative border-2 border-blue-500 hover:bg-blue-300 hover:border-blue-300 text-gray-500 hover:text-white rounded-3xl p-2"
								onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
									e.stopPropagation();
									window.location.href = "/dash/em/event/" + id;
								}}>
								<IoSettingsSharp className="" />
							</button>
						)}
					</div>
				</div>

				<hr className="my-2 border-gray-500" />
				<div className="text-wrap flex">
					<div className="text-gray-300 leading-8">
						<p className="font-mono flex">
							<MdDateRange className="mr-2 mt-2" /> {moment(date, "YYYY-MM-DDTHH:mm").format("HH:mm DD.MMMM.YYYY")}
						</p>
						<p className="italic flex">
							<CiLocationOn className="mr-2 mt-2" />
							{location}
						</p>
						<p className="flex ">
							<FaHeadphones className="mr-2 mt-2" />
							{str.substring(0, str.length - 2)}
						</p>
					</div>
				</div>
			</div>
			{EventReactions(id, reacted, tcoming, setTComing, tliked, setTLiked)}
		</div>
	);
}

export default EventView;

export function EventReactions(
	id: number,
	reacted: (name: string, value: boolean) => void,
	tcoming: boolean,
	setTComing: React.Dispatch<React.SetStateAction<boolean>>,
	tliked: boolean,
	setTLiked: React.Dispatch<React.SetStateAction<boolean>>
) {
	return (
		<div className="p-3 flex text-2xl gap-10 justify-end">
			<Link href={"/event/" + id}>
				<CgMoreVertical />
			</Link>
			<button
				name="participating"
				onClick={() => {
					reacted("participating", !tcoming);
					setTComing((prev) => {
						return !prev;
					});
				}}>
				{tcoming ? (
					<FaHandPeace className="text-green-500" />
				) : (
					<FaHandFist className="text-white hover:text-gray-300" />
				)}
			</button>
			<button
				name="like"
				className={tliked ? "text-red-500 hover:text-red-400" : "text-white hover:text-gray-300"}
				onClick={() => {
					reacted("like", !tliked);
					setTLiked((prev) => {
						return !prev;
					});
				}}>
				<FaHeart />
			</button>
		</div>
	);
}
