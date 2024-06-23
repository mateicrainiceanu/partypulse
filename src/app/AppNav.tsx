"use client";

import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {FaBars, FaTimes} from "react-icons/fa";
import {UserContext} from "./UserContext";
import {IUserNotification, UserNotifContext} from "./UserNotifContext";
import {IoIosNotifications} from "react-icons/io";
import {IoNotificationsOff} from "react-icons/io5";
import { deleteCookie } from "cookies-next";

const Navbar = () => {
	const [nav, setNav] = useState(false);
	const {user} = useContext(UserContext);
	const {showNotif, hideNotif, show, notifications} = useContext(UserNotifContext);

	function handleLogout() {
		deleteCookie('token');
		deleteCookie('userId');
		deleteCookie('uname');
		deleteCookie('fname');
		deleteCookie('role');
		deleteCookie('email');
		deleteCookie('donations');
		window.location.replace('/')
	}

	const links = [
		{
			id: 1,
			link: "/",
			title: "Home",
			needsLogIn: false,
		},
		{
			id: 4,
			title: "Dash",
			link: "/dash",
			needsLogIn: true,
		},
		{
			id: 5,
			title: "Settings",
			link: "/dash/settings",
			needsLogIn: true,
		},
	];

	return (
		<>
			<div className="flex justify-between items-center w-full h-20 px-4 text-white sticky top-0 my-2 nav z-50">
				<div>
					<Link href="/">
						<Image draggable={false} priority src="/logo_white.png" width="100" height="100" alt="logo" />
					</Link>
				</div>

				<ul className="hidden lg:flex">
					{links
						.filter(({needsLogIn}) => !needsLogIn || user.logged)
						.map(({id, title, link, needsLogIn}) => (
							<li
								key={id}
								className="nav-links px-4 cursor-pointer capitalize font-mono font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline my-auto">
								{<Link href={link}>{title}</Link>}
							</li>
						))}
					<li className="nav-links px-4 cursor-pointer capitalize font-mono font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline my-auto">
						{user.logged ? <button onClick={handleLogout}>Logout</button> : <Link href={"/login"}>Login</Link>}
					</li>

					<li className="my-auto">
						{!show && user.logged && (
							<IoIosNotifications
								onClick={showNotif}
								size={30}
								className={
									notifications.filter((n: IUserNotification) => n.status == 0).length > 0
										? "text-red-400 hover:text-red-500"
										: "text-gray-500 hover:text-white"
								}
							/>
						)}
					</li>
				</ul>
				<div className="flex gap-4 cursor-pointer pr-4 z-10 lg:hidden">
					<div>
						{show ? (
							<IoNotificationsOff size={30} onClick={hideNotif} className="text-gray-500 hover:text-white" />
						) : (
							<IoIosNotifications
								onClick={showNotif}
								size={30}
								className={
									notifications.filter((n: IUserNotification) => n.status == 0).length > 0
										? "text-red-400 hover:text-red-500"
										: "text-gray-500 hover:text-white"
								}
							/>
						)}
					</div>
					<div onClick={() => setNav(!nav)} className=" text-gray-500 lg:hidden hover:text-white">
						{!nav ? <FaBars size={30} /> : <FaTimes size={30} />}
					</div>
				</div>

				{nav && (
					<ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-violet-800 text-gray-500">
						{links
							.filter(({needsLogIn}) => !needsLogIn || user.logged)
							.map(({id, title, link, needsLogIn}) => (
								<li key={id} className="px-4 cursor-pointer py-6 font-mono text-4xl hover:text-white">
										<Link onClick={() => setNav(!nav)} href={link}>
											{title}
										</Link>
								</li>
							))}
						<li className="px-4 cursor-pointer py-6 font-mono text-4xl hover:text-white">
							{user.logged ? <button onClick={handleLogout}>Logout</button> : <Link href={"/login"}>Login</Link>}
						</li>
					</ul>
				)}
			</div>
		</>
	);
};

export default Navbar;
