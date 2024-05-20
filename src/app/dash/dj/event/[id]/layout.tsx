"use client";

import {WebSocketProvider} from "next-ws/client";

export default function Layout({children}: React.PropsWithChildren) {
	return <WebSocketProvider url={`ws://${window.location.host || ""}/api/ws`}>{children}</WebSocketProvider>;
}
