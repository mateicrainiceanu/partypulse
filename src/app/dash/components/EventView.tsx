import React from "react";
import moment from "moment";

import {MdDateRange} from "react-icons/md";
import {CiLocationOn} from "react-icons/ci";
import {FaHeadphones} from "react-icons/fa6";

function EventView({
	id,
	name,
	date,
	location,
	djs,
}: {
	id: number;
	name: string;
	date: string;
	location: string;
	djs: Array<string>;
}) {
	var str = "";
	djs.map((dj) => {
		str += dj + ", ";
	});

	return (
		<div className="w-full bg-slate-800 hover:bg-slate-900 text-left p-4 rounded-xl my-2">
			<h5 className="text-center font-bold text-lg font-mono ">{name}</h5>
			<hr className="my-2" />
			<div className="text-wrap flex">
				<div className="text-gray-300 leading-8">
					<p className="font-mono flex">
						<MdDateRange className="mr-2 mt-2" /> {moment(date, "YYYY-MM-DDTHH:MM").format("HH:MM DD.MMMM.YYYY")}
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
				{/* <div className="ms-auto">
						<Image src="/club.jpg" alt="decorative" width={150} height={150}></Image>
					</div> */}
			</div>
		</div>
	);
}

export default EventView;
