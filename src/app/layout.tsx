import type {Metadata} from "next";
import {Inter} from "next/font/google";
import Navbar from "./AppNav";
import "./globals.css";
import UserNotifProvider from "./UserNotifContext";
import AlertProvider from "./AlertContext";
import UserProvider from "./UserContext";
import LoadingProvider from "./LoadingContext";
import SessionProvider from "./components/SessionProvider";
import {getServerSession} from "next-auth";
import LoadManProvider from "./LoadManContext";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
	title: "Partypulse",
	description: "The app for your party",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
	const session = await getServerSession();
	return (
		<html lang="en">
			<body className={inter.className}>
				<LoadingProvider>
					<LoadManProvider>
						<SessionProvider session={session}>
							<AlertProvider>
								<UserProvider>
									<UserNotifProvider>
										<Navbar />
										<main className="mx-2">{children}</main>
									</UserNotifProvider>
								</UserProvider>
							</AlertProvider>
						</SessionProvider>
					</LoadManProvider>
				</LoadingProvider>
			</body>
		</html>
	);
}
