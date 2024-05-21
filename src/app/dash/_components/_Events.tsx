//NOT CURRENTLY USED

import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import EventView from "./EventView";
import {Button, ButtonGroup, Pagination} from "@mui/material";
import {AlertContext} from "@/app/AlertContext";
import {LoadManContext} from "@/app/LoadManContext";
import FormElement from "@/app/components/FormElement";
import moment from "moment";
import FormBtn from "@/app/components/FormBtn";

function Events({
	givenEvents,
	filter,
	onlyManaged,
}: {
	onlyManaged?: boolean;
	filter?: string;
	givenEvents?: Array<{
		id: number;
		name: string;
		location: string;
		dateStart: string;
		djs: Array<string>;
		status: number;
		there: boolean;
		coming: boolean;
		liked: boolean;
	}>;
}) {
	const [events, setEvents] = useState(givenEvents || []);
	const [pg, setPg] = useState(1);
	const showOnPg = 3;
	const {addLoadingItem, finishedLoadingItem} = useContext(LoadManContext);
	const {handleAxiosError} = useContext(AlertContext);
	const [statusFilter, setStatusFilter] = useState(-1);
	const [dateFilter, setDateFilter] = useState("");
	const [showFilterByDate, setShowFilterByDate] = useState(false);

	useEffect(() => {
		if (!givenEvents) {
			addLoadingItem();
			axios
				.get("/api/event" + (onlyManaged ? "?onlyManaged=true" : ""))
				.then((response) => {
					setEvents(response.data);
					finishedLoadingItem();
				})
				.catch(handleAxiosError);
		}
	}, []);

	function filterDataByStatus(status: number) {
		if (statusFilter == -1) return true;
		else return status == statusFilter;
	}

	function filterDataByDate(date: string) {
		if (dateFilter == "") {
			return true;
		} else {
			return moment(date, "YYYY-MM-DD").toString() == moment(dateFilter, "YYYY-MM-DD").toString();
		}
	}

	return (
		<div>
			<div className="flex justify-center gap-2">
				<ButtonGroup variant="outlined" aria-label="Loading button group" className="">
					<Button
						color="primary"
						onClick={() => {
							setStatusFilter(-1);
						}}
						className={statusFilter == -1 ? " bg-blue-900 " : ""}>
						All
					</Button>
					<Button
						color="secondary"
						onClick={() => {
							setStatusFilter(0);
						}}
						className={statusFilter == 0 ? " bg-fuchsia-900 " : ""}>
						Future
					</Button>
					<Button
						color="success"
						onClick={() => {
							setStatusFilter(1);
						}}
						className={statusFilter == 1 ? " bg-green-900 " : ""}>
						Live
					</Button>
					<Button
						color="error"
						onClick={() => {
							setStatusFilter(2);
						}}
						className={statusFilter == 2 ? " bg-red-900 " : ""}>
						Ended
					</Button>
				</ButtonGroup>
				<Button
					color="warning"
					variant="outlined"
					className={" " + (showFilterByDate ? " bg-orange-900 " :"")}
					onClick={() => {
						setShowFilterByDate((prev) => !prev);
					}}>
					Filter by date
				</Button>
			</div>
			{showFilterByDate && (
				<div className="flex gap-2 justify-center">
					<div className="w-1/2">
						<FormElement
							label=""
							name="date"
							type="date"
							value={dateFilter}
							handleChange={(e) => {
								setDateFilter(e.target.value);
							}}></FormElement>
					</div>
					<div className="max-w-1/2">
						<FormBtn
							name={"Clear"}
							onClick={() => {
								setDateFilter("");
							}}
						/>
					</div>
				</div>
			)}
			{(events.length != 0 || givenEvents?.length != 0) && (
				<>
					{givenEvents?.length != 0 && givenEvents != undefined ? (
						<div className="max-w-xl mx-auto">
							{givenEvents
								?.filter(
									({status, dateStart}: {status: number; dateStart: string}) =>
										filterDataByStatus(status) && filterDataByDate(dateStart)
								)
								.slice((pg - 1) * showOnPg, pg * showOnPg)
								.map(
									(
										event: {
											id: number;
											name: string;
											location: string;
											dateStart: string;
											djs: Array<string>;
											status: number;
											there: boolean;
											coming: boolean;
											liked: boolean;
											userHasRightToManage?: number;
										},
										i
									) => (
										<EventView
											showManage={event.userHasRightToManage == 1 || event.userHasRightToManage == 2}
											status={event.status}
											name={event.name}
											location={event.location}
											id={event.id}
											date={event.dateStart}
											djs={event.djs}
											key={event.id}
											there={event.there}
											coming={event.coming}
											liked={event.liked}
										/>
									)
								)}
							{(givenEvents?.length || 0) > showOnPg && (
								<div className="flex justify-center my-2">
									<Pagination
										count={Math.ceil((givenEvents?.length || 0) / showOnPg)}
										page={pg}
										onChange={(_: any, val: number) => {
											setPg(val);
										}}
									/>
								</div>
							)}
						</div>
					) : (
						<>
							{events
								.filter(
									({name, status, dateStart}: {name: string; status: number; dateStart: string}) =>
										name.includes(filter || "") && filterDataByStatus(status) && filterDataByDate(dateStart)
								)
								.slice((pg - 1) * showOnPg, pg * showOnPg)
								.map(
									(
										event: {
											id: number;
											name: string;
											location: string;
											dateStart: string;
											djs: Array<string>;
											status: number;
											there: boolean;
											coming: boolean;
											liked: boolean;
											userHasRightToManage?: number;
										},
										i
									) => (
										<div key={(pg - 1) * showOnPg + i}>
											<EventView
												showManage={event.userHasRightToManage == 1 || event.userHasRightToManage == 2}
												status={event.status}
												name={event.name}
												location={event.location}
												id={event.id}
												date={event.dateStart}
												djs={event.djs}
												key={event.id}
												there={event.there}
												coming={event.coming}
												liked={event.liked}
											/>{" "}
										</div>
									)
								)}
							{events.length > showOnPg && (
								<div className="flex justify-center my-2">
									<Pagination
										count={Math.ceil(events.length / showOnPg)}
										page={pg}
										onChange={(_: any, val: number) => {
											setPg(val);
										}}
									/>
								</div>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
}

export default Events;
