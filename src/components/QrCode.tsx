import {useQRCode} from "next-qrcode";
import React from "react";

function QrCode({link}: {link: string}) {
	const {Canvas} = useQRCode();
	return (
		<div>
			<Canvas
				text={link}
				options={{
					errorCorrectionLevel: "H",
					margin: 2,
					width: 500,
					color: {
						dark: "#fff",
						light: "#000",
					},
				}}
				logo={{src: "/logo_color.jpeg", options: {width: 150}}}
			/>
		</div>
	);
}

export default QrCode;
