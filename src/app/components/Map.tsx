import React from "react";

interface IProps {
	q: string;
}

function Map({q}:IProps) {
	return (
		<iframe
			width="100%"
			height="200"
			style={{border: 0}}
			referrerPolicy="no-referrer-when-downgrade"
            loading="lazy"
			src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GM_API_KEY}&q=${q}`}
			allowFullScreen></iframe>
	);
}

export default Map;