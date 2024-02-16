import React from "react";

import {MdDateRange} from "react-icons/md";
import {CiLocationOn} from "react-icons/ci";
import {FaHeadphones} from "react-icons/fa6";

function EventsView() {
	return (
		<div className="w-full bg-slate-800 hover:bg-slate-900 text-left p-4 rounded-xl">
			<h5 className="text-center font-bold text-lg font-mono ">V-day Party</h5>
			<hr className="my-2" />
			<div className="text-wrap flex">
				<div className="text-gray-300 leading-8">
					<p className="font-mono flex">
						<MdDateRange className="mr-2 mt-2" /> 14 february
					</p>
					<p className="italic flex">
						<CiLocationOn className="mr-2 mt-2" />
						Fratelli Club
					</p>
					<p className="flex ">
						<FaHeadphones className="mr-2 mt-2" />
						dj_matthew
					</p>
				</div>
				{/* <div className="ms-auto">
						<Image src="/club.jpg" alt="decorative" width={150} height={150}></Image>
					</div> */}
			</div>
		</div>
	);
}

export default EventsView;
