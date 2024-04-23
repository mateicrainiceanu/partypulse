import React from "react";
import moment from "moment";

import {MdDateRange} from "react-icons/md";
import {CiLocationOn} from "react-icons/ci";
import {FaHeadphones} from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";

function EventView({
	id,
	name,
	date,
	location,
	djs,
	showManage
}: {
	id: number;
	name: string;
	date: string;
	location: string;
	djs: Array<string>;
	showManage: boolean
}) {
	var str = "";
	djs.map((dj) => {
		str += dj + ", ";
	});

	return (
		<div className="w-full bg-slate-800 hover:bg-slate-900 text-left p-4 rounded-xl my-2 relative">
			{showManage && (
				<button
					className="absolute right-2 top-2 border-2 border-blue-500 hover:bg-blue-300 hover:border-blue-300 text-gray-500 hover:text-white rounded-3xl p-2"
					onClick={() => {
						window.location.href = "/dash/em/manage-event/" + id;
					}}>
					<IoSettingsSharp className="" />
				</button>
			)}
			<h5 className="text-center font-bold text-lg font-mono ">{name}</h5>
			<hr className="my-2" />
			<div className="text-wrap flex">
				<div className="text-gray-300 leading-8">
					<p className="font-mono flex">
						<MdDateRange className="mr-2 mt-2" /> {moment(date.replace("T", " "), "YYYY-MM-DD HH:mm").format("HH:mm DD.MMMM.YYYY")}
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
