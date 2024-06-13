"use client";
import {FaMusic} from "react-icons/fa";

export default function Home() {
	return (
		<div className="py-10">
			<main className="flex min-h-11/12 flex-col items-center p-24 select-none">
				<div className="min-h-11/12 flex items-center justify-center py-24">
					<div>
						<FaMusic className="text-7xl mx-auto mb-10" />
						<h1 className="text-5xl font-sans leading-snug text-center">
							Welcome to <b className="font-bold animate-pulse">PartyPulse!</b>
						</h1>
						<h2 className="text-center font-mono text-gray-300">An app for your fun and partys</h2>
						<div className="flex justify-center my-10">
							<button
								className="bg-lime-400 text-black font-bold rounded-lg p-2 font-mono hover:bg-fuchsia-500 duration-200"
								onClick={() => {
									window.location.href = "/register";
								}}>
								Try out now
							</button>
						</div>
					</div>
				</div>
			</main>

			<div className="max-w-xl mx-auto tracking-wider">
				<h2 className="font-mono text-xl text-center my-2">Our story starts with passion!</h2>
				<hr className="mb-10" />
				<p>
					Just like any good story worth telling, the starting-point for this app was the passion for the art of DJ-ing.
				</p>
				<p className="mt-6">
					The small goal was to create an app that enables {"DJ's"} to have a better communication with their audience.
					But we have never stoped there. We wanted to create the next big thing for parting and we strongly belive in
					developing this app forward.
				</p>
			</div>
			<div className="max-w-xl mx-auto tracking-wider my-12">
				<h2 className="font-mono text-xl text-center my-2">
					Everything starts small but our plan is to never stop growing.
				</h2>
				<hr className="mb-10" />
				<p>
					The start is hard. As this platform was only developed by a team of one, there is of course lots and lots to
					learn and improve. But the most important thing, when you have a plan is to start. So this is the start.
				</p>
			</div>
			<div className="max-w-xl mx-auto tracking-wider my-12">
				<h2 className="font-mono text-xl text-center my-2">start small. dream big</h2>
				<hr className="mb-10" />
				<p>This one is self-explained. There is always a starting-point, but there can be no ending points.</p>
			</div>
		</div>
	);
}
