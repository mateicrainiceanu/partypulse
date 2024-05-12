import React, {useContext, useEffect, useState} from "react";
import {FaHeadphones} from "react-icons/fa";
import {FaRegUser} from "react-icons/fa";
import {BiParty} from "react-icons/bi";
import "./dash.css";
import {IoMdCloseCircle} from "react-icons/io";
import {IoHeart} from "react-icons/io5";
import axios from "axios";
import moment from "moment";
import {BeatLoader} from "react-spinners";
import {AlertContext} from "@/app/AlertContext";

// interface UserModelDisplay {
// 	id: number;
// 	fname: string;
// 	lname: string;
// 	uname: string;
// 	role: number;
// 	youFollow: boolean;
// 	followsYou: boolean;
// 	donations: string;
// 	created: string;
// }

// function UserSmViewWithDetails({user}: {user: UserModelDisplay}) {
// 	return (
// 		<div className={"w-full px-2 py-2 border-btm hover:bg-gray-800"} onClick={() => {}}>
// 			<div className="flex gap-3 py-3">
// 				{user.role === 0 && <FaRegUser className="my-1" />}
// 				{user.role === 1 && <BiParty className="my-1" />}
// 				{user.role === 2 && <FaHeadphones className="my-1" />}
// 				<span>{user.uname}</span>
// 			</div>
// 		</div>
// 	);
// }

function UserSmView({uname, role, rounded}: {uname: string; role: number, rounded?:boolean}) {
	const [smView, setSmView] = useState(false);

	return (
		<div
			className={"w-full px-2 py-2 border-btm " + (smView ? "" : "hover:bg-gray-800") + (rounded ? " rounded-lg": "")
			}
			onClick={() => {
				setSmView(true);
			}}>
			{smView ? (
				<UserDetailedView
					uname={uname}
					close={() => {
						setSmView((prev) => !prev);
					}}
				/>
			) : (
				<div className="flex gap-3 py-3">
					{role === 0 && <FaRegUser className="my-1" />}
					{role === 1 && <BiParty className="my-1" />}
					{role === 2 && <FaHeadphones className="my-1" />}
					<span>{uname}</span>
				</div>
			)}
		</div>
	);
}

function UserDetailedView({uname, close}: {uname: string; close: () => void}) {
	const [tliked, setTLiked] = useState(false);
	const {handleAxiosError} = useContext(AlertContext);

	const [chosenUser, setChosenUser] = useState({
		id: 0,
		fname: "",
		lname: "",
		uname: "",
		youFollow: false,
		followsYou: false,
		donations: "",
		created: "",
	});

	useEffect(() => {
		axios
			.get("/api/user/relation/" + uname)
			.then((response) => {
				setChosenUser(response.data);
				setTLiked(response.data.youFollow);
			})
			.catch((err) => {
				handleAxiosError(err);
			});
	}, []);

	function handleLike() {
		const val = !tliked;
		axios
			.post("/api/user/relation", {secUserUname: uname, reltype: 1, val: val})
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				handleAxiosError(err);
			});
		setTLiked((prev) => !prev);
	}

	return (
		<div>
			<div className="bg-gray-900 rounded-lg relative">
				<div className="p-4">
					<button
						className="absolute right-5 top-5 text-xl"
						onClick={(e: any) => {
							e.stopPropagation();
							close();
						}}>
						<IoMdCloseCircle />
					</button>
					<h5 className="text-center font-bold">{uname}</h5>
					{chosenUser.id != 0 && (
						<div className="text-left font-sans">
							<p>{chosenUser.fname + " " + chosenUser.lname}</p>
							<p>Joined: {moment(chosenUser.created).format("MMMM YYYY")}</p>
						</div>
					)}
				</div>
				<div className="flex text-3xl py-2 px-3 justify-center bg-slate-800 rounded-b-lg">
					{chosenUser.id != 0 ? (
						<button onClick={handleLike}>
							<IoHeart className={!tliked ? "text-gray-200 hover:text-gray-300" : "text-red-500 hover:text-red-400"} />
						</button>
					) : (
						<BeatLoader color="#fff" />
					)}
				</div>
			</div>
		</div>
	);
}

// export type {UserModelDisplay};
// export {UserSmViewWithDetails};
export default UserSmView;
