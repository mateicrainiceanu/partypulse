"use client";
import React, {ReactNode, createContext, useContext, useEffect, useState} from "react";
import {getCookie, setCookie} from "cookies-next";
import axios, {AxiosError} from "axios";
import {LoadingContext} from "./LoadingContext";
import Link from "next/link";
import {Alert, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";
import {LoadManContext} from "./LoadManContext";

const AlertContext = createContext(null as any);

interface AppDialog {
	title: string;
	content?: string;
	actionButtons?: Array<{btnName: string; func: () => void}>;
}

function AlertProvider({children}: {children: ReactNode}) {
	const [alert, setAlert] = useState(null as any);
	const [dialog, setDialog] = useState(null as any);

	const {finishedLoadingItem} = useContext(LoadManContext);

	useEffect(() => {
		if (getCookie("c-permisson") != "ok") {
			setAlert({
				prompt: "We are using cookies!",
				severity: "info",
				btnTxt: "Ok",
				btnClick: acceptCookies,
				href: "/cookies",
				hrefTag: "Read more",
			});
		}
	}, []);
	//
	useEffect(() => {
		if (alert?.autoClose) {
			setTimeout(() => {
				setAlert(null);
			}, 5000);
		}
	}, [alert]);

	function handleAxiosError(err: AxiosError) {
		if (err.response?.status == 403) {
			setCookie("prevUrl", window.location.href);
			window.location.replace("/login");
		}

		finishedLoadingItem();
		if (err.response?.data) setAlert({severity: "error", prompt: err.response?.data, autoClose: true});
	}

	function handleError(text: string, tp: string) {
		setAlert({prompt: text, severity: tp, autoClose: true});
	}

	function dialogToUser(dialog: AppDialog) {
		let diaToSet = dialog;
		if (!dialog.actionButtons) {
			diaToSet = {
				...diaToSet,
				actionButtons: [
					{
						btnName: "Close",
						func: () => {
							setDialog(null);
						},
					},
				],
			};
		}

		setDialog(diaToSet);
	}

	function acceptCookies() {
		setCookie("c-permisson", "ok");
		setAlert(null);
	}

	function handleDialogClose() {
		setDialog(null);
	}

	return (
		<AlertContext.Provider value={{handleAxiosError, dialogToUser, handleError}}>
			{alert != null && (
				<div className="fixed md:right-10 md:bottom-10 right-5 bottom-5 z-50">
					<Alert
						severity={alert.severity}
						action={
							<>
								{alert.href && (
									<Button
										color="secondary"
										onClick={() => {
											window.location.href = alert.href;
										}}>
										{alert.hrefTag}
									</Button>
								)}
								<Button color="inherit" onClick={alert.btnClick}>
									{alert.btnTxt}
								</Button>
							</>
						}>
						<div className="mr-3">{alert.prompt}</div>
					</Alert>
				</div>
			)}
			{dialog != null && (
				<Dialog
					open={dialog != null}
					onClose={handleDialogClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description">
					<DialogTitle>{dialog.title}</DialogTitle>
					{dialog.content && (
						<DialogContent>
							<DialogContentText>{dialog.content}</DialogContentText>
						</DialogContent>
					)}
					{dialog.actionButtons != undefined && (
						<DialogActions>
							{dialog.actionButtons.map((action: {func: () => void; btnName: string}, i: number) => (
								<Button
									key={i}
									onClick={() => {
										action.func();
										setDialog(null);
									}}>
									{action.btnName}
								</Button>
							))}
						</DialogActions>
					)}
				</Dialog>
			)}

			{children}
		</AlertContext.Provider>
	);
}

export {AlertContext};
export default AlertProvider;
