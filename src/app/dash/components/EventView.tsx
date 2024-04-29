import React from "react";
import moment from "moment";

import {MdDateRange} from "react-icons/md";
import {CiLocationOn} from "react-icons/ci";
import {FaHeadphones} from "react-icons/fa6";
import {IoSettingsSharp} from "react-icons/io5";
import {BsCircleFill} from "react-icons/bs";

function EventView({
	id,
	name,
	date,
	location,
	djs,
	showManage,
	status,
}: {
	id: number;
	name: string;
	date: string;
	location: string;
	djs: Array<string>;
	showManage: boolean;
	status: number;
}) {
	var str = "";
	djs.map((dj) => {
		str += dj + ", ";
	});

	return (
		<div
			className="w-full bg-slate-800 hover:bg-slate-900 text-left p-4 rounded-xl my-2 relative"
			onClick={() => {
				window.location.href = "/event/" + id;
			}}>
			{showManage && (
				<button
					className="absolute right-2 top-2 border-2 border-blue-500 hover:bg-blue-300 hover:border-blue-300 text-gray-500 hover:text-white rounded-3xl p-2"
					onClick={() => {
						window.location.href = "/dash/em/event/" + id + "/manage";
					}}>
					<IoSettingsSharp className="" />
				</button>
			)}
			{status === 1 && (
				<>
					<div className="absolute top-4 left-4 text-green-500">
						<BsCircleFill></BsCircleFill>
					</div>
					{/* <span className="absolute left-10 top-3 text-green-500">Live</span> */}
				</>
			)}

			{status === 2 && (
				<>
					<div className="absolute top-4 left-4 text-red-500 flex">
						<BsCircleFill></BsCircleFill>
					</div>
					{/* <span className="absolute left-6 text-red-500">Ended</span> */}
				</>
			)}
			<h5 className="text-center font-bold text-lg font-mono ">{name}</h5>
			<hr className="my-2" />
			<div className="text-wrap flex">
				<div className="text-gray-300 leading-8">
					<p className="font-mono flex">
						<MdDateRange className="mr-2 mt-2" />{" "}
						{moment(date, "YYYY-MM-DDTHH:mm").format("HH:mm DD.MMMM.YYYY")}
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
	);
}

export default EventView;
