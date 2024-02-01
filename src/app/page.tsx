import Image from "next/image";
import { FaMusic } from "react-icons/fa";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<div className="min-h-screen flex items-center justify-center">
				<div>
					<FaMusic className="text-7xl mx-auto mb-10"/>
					<h1 className="text-5xl font-sans leading-snug text-center">
						Welcome to <b className="font-bold">PartyPulse!</b>
					</h1>
          <h2 className="text-center font-mono text-gray-300">An app for your fun and partys</h2>
          
				</div>
			</div>
		</main>
	);
}
