"use client";

import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {FaBars, FaTimes} from "react-icons/fa";
import {UserContext} from "./UserContext";

const Navbar = () => {
	const [nav, setNav] = useState(false);
	const {user, getUserData} = useContext(UserContext);

	useEffect(()=>{
		if (!user.logged){
			getUserData()
		}
	}, [user])

	const links = [
		{
			id: 1,
			link: "/",
			name: "Home",
			needsLogIn: false,
		},
		{
			id: 2,
			link: "/about",
			name: "About",
			needsLogIn: false,
		},
		{
			id: 3,
			name: !user.logged ? "login" : "logout",
			link: !user.logged ? "/login" : "/logout",
			needsLogIn: false,
		},
		{
			id: 4,
			name: "dash",
			link: "/dash",
			needsLogIn: true,
		},
		{
			id: 5,
			name: "settings",
			link: "/dash/settings",
			needsLogIn: true,
		},
	];

	return (
		<>
			<div className="flex justify-between items-center w-full h-20 px-4 text-white sticky-top my-2 nav">
				<div>
					<Link href="/">
						<Image draggable={false} src="/logo_white.png" width="100" height="100" alt="logo" />
					</Link>
				</div>

				<ul className="hidden md:flex">
					{links.map(({id, link}) => (
						<li
							key={id}
							className="nav-links px-4 cursor-pointer capitalize font-mono font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
							<Link href={link}>{link}</Link>
						</li>
					))}
				</ul>

				<div onClick={() => setNav(!nav)} className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden hover:text-white">
					{nav ? <FaTimes size={30} /> : <FaBars size={30} />}
				</div>

				{nav && (
					<ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-violet-800 text-gray-500">
						{links.map(({id, name, link, needsLogIn}) => (
							<li key={id} className="px-4 cursor-pointer capitalize py-6 font-mono text-4xl hover:text-white">
								{(!needsLogIn || user.logged) && (
									<Link onClick={() => setNav(!nav)} href={link}>
										{name}
									</Link>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
};

export default Navbar;
