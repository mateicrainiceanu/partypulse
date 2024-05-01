import React, {useState} from "react";
import LocationSmView from "../../../LocationSmView";
import {Pagination} from "@mui/material";

function Locations({locations}: {locations: Array<{name: string; id: number; adress: string}>}) {
	const [pg, setPg] = useState(1);
	var resPerPage = 4;

	return (
		<div>
			<div className="max-w-xl mx-auto m-2">
				{locations.slice((pg - 1) * resPerPage, pg * resPerPage).map((location, i) => (
					<LocationSmView key={i} locationData={location} />
				))}
				{locations.length > resPerPage && (
					<div className="flex my-2 justify-center">
						<Pagination
							count={Math.ceil(locations.length / resPerPage)}
							page={pg}
							onChange={(_: any, val: number) => {
								setPg(val);
							}}></Pagination>
					</div>
				)}
			</div>
		</div>
	);
}

export default Locations;
