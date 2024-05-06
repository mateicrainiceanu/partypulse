import type {Metadata} from "next";
import {Inter} from "next/font/google";
import Navbar from "./AppNav";
import "./globals.css";

import UserProvider from "./UserContext";
import LoadingProvider from "./LoadingContext";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
	title: "Partypulse",
	description: "The app for your party",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<LoadingProvider>
					<UserProvider>
						<Navbar />
						<main className="mx-2">{children}</main>
					</UserProvider>
				</LoadingProvider>
			</body>
		</html>
	);
}
