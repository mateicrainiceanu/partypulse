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
import {FullEvent} from "@/types";
import {AlertContext} from "@/app/AlertContext";

function EventView({evdata}: {evdata: FullEvent}) {
	const {user} = useContext(UserContext);

	const [tliked, setTLiked] = useState(evdata.liked);
	const [tcoming, setTComing] = useState(evdata.coming);

	const {handleAxiosError, dialogToUser} = useContext(AlertContext);

	var str = "";
	evdata.djs?.map((dj) => {
		str += dj + ", ";
	});

	function djable() {
		var djable = false;
		evdata.djs?.map((dj) => {
			if (dj === user.uname) djable = true;
		});

		return djable;
	}

	function reacted(name: string, value: boolean) {
		if (name != "like" && !value && evdata.privateev) {
			dialogToUser({
				title: "Are you sure?",
				content:
					"This is a private event. If you deselect the going button you will not see this event, unless the host invites you one more time.",
				actionButtons: [
					{btnName: "Cancel", func: () => {}},
					{
						btnName: "Proceed",
						func: () => {
							setTComing((prev) => !prev);
							axios.post("/api/event/reaction", {eventId: evdata.id, name: 4, value: value}).catch(handleAxiosError);
						},
					},
				],
			});
		} else {
			if (name == "like") setTLiked((prev) => !prev);
			else setTComing((prev) => !prev);
			axios
				.post("/api/event/reaction", {eventId: evdata.id, name: name === "like" ? 5 : 4, value: value})
				.catch(handleAxiosError);
		}
	}

	return (
		<div className="w-full rounded-xl bg-gray-900 dark:bg-fuchsia-800 dark:bg-opacity-20 bg-opacity-20 dark:text-gray-100 my-2">
			<div
				className=" bg-gray-900 bg-opacity-20 dark:bg-fuchsia-800 dark:bg-opacity-20 hover:bg-opacity-30 text-left p-4 rounded-t-xl "
				onClick={() => {
					window.location.href = "/event/" + evdata.id;
				}}>
				<div className="flex w-full">
					{evdata.status === 1 && (
						<div className="my-auto mr-2 text-green-500">
							<BsCircleFill></BsCircleFill>
						</div>
					)}

					{evdata.status === 2 && (
						<div className="my-auto mr-2 text-red-500 flex">
							<BsCircleFill></BsCircleFill>
						</div>
					)}
					<h5 className="text-center font-bold text-lg font-mono my-auto">{evdata.name}</h5>
					<div className="ms-auto my-auto flex">
						{djable() && (
							<button
								className="relative mx-1 border-2 border-fuchsia-500 hover:bg-fuchsia-500 hover:border-fuchsia-500 text-gray-500 hover:text-white rounded-3xl p-2"
								onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
									e.stopPropagation();
									window.location.href = "/dash/dj/event/" + evdata.id;
								}}>
								<FaHeadphones className="" />
							</button>
						)}
						{evdata.userHasRightToManage && (
							<button
								className="relative border-2 border-blue-500 hover:bg-blue-300 hover:border-blue-300 text-gray-500 hover:text-white rounded-3xl p-2"
								onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
									e.stopPropagation();
									window.location.href = "/dash/em/event/" + evdata.id;
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
							<MdDateRange className="mr-2 mt-2" />{" "}
							{moment(evdata.dateStart, "YYYY-MM-DDTHH:mm").format("HH:mm DD.MMMM.YYYY")}
						</p>
						<p className="italic flex">
							<CiLocationOn className="mr-2 mt-2" />
							{evdata.location}
						</p>
						<p className="flex ">
							<FaHeadphones className="mr-2 mt-2" />
							{str.substring(0, str.length - 2)}
						</p>
					</div>
				</div>
			</div>
			{EventReactions(evdata.id, reacted, tcoming, tliked, evdata.nrliked, evdata.nrcoming)}
		</div>
	);
}

export default EventView;

export function EventReactions(
	id: number,
	reacted: (name: string, value: boolean) => void,
	tcoming: boolean,
	tliked: boolean,
	nrliked: number,
	nrcoming: number
) {
	return (
		<div className="p-3 flex text-2xl gap-10 justify-end">
			<Link href={"/event/" + id}>
				<CgMoreVertical />
			</Link>
			<div className="flex gap-2">
				<span className="text-lg my-auto">{nrcoming}</span>
				<button
					name="participating"
					onClick={() => {
						reacted("participating", !tcoming);
					}}>
					{tcoming ? (
						<FaHandPeace className="text-green-500" />
					) : (
						<FaHandFist className="text-white hover:text-gray-300" />
					)}
				</button>
			</div>
			<div className="flex gap-2">
				<span className="text-lg my-auto">{nrliked}</span>
				<button
					name="like"
					className={tliked ? "text-red-500 hover:text-red-400" : "text-white hover:text-gray-300"}
					onClick={() => {
						reacted("like", !tliked);
					}}>
					<FaHeart />
				</button>
			</div>
		</div>
	);
}
