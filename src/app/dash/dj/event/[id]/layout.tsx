"use client";

import {WebSocketProvider} from "next-ws/client";

export default function Layout({children}: React.PropsWithChildren) {
	return <WebSocketProvider url={`ws://localhost:3000/api/ws`}>{children}</WebSocketProvider>;
}
