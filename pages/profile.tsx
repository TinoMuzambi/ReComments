import {
	FormEventHandler,
	MouseEventHandler,
	useContext,
	useEffect,
	useState,
} from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { UserModel } from "../interfaces";
import { postUpdatedResourceToDb } from "../utils";
import { handleSignoutClick } from "../utils/gapi";
import Notice from "../components/Notice";
import HistoryResult from "../components/HistoryResult";
import Spinner from "../components/Spinner";

const Profile: React.FC = (): JSX.Element => {
	const { dbUser, signedIn, setSignedIn, setDbUser, setUser } =
		useContext(AppContext);
	const [name, setName] = useState(dbUser?.shortName);
	const [email, setEmail] = useState(dbUser?.email);
	const [emails, setEmails] = useState<boolean | undefined>(dbUser?.emails);
	const [deleteOrSubmitOrClear, setDeleteOrSubmitOrClear] = useState<
		"delete" | "submit" | "clear"
	>("submit");
	const [spinnerVisible, setSpinnerVisible] = useState(false);

	const [noticeVisible, setNoticeVisible] = useState<boolean>(false);
	const [noticeNoButtons, setNoticeNoButtons] = useState<1 | 2>(1);
	const [noticeTitle, setNoticeTitle] = useState("");
	const [noticeSubtitle, setNoticeSubtitle] = useState("");
	const [noticeFirstButtonText, setNoticeFirstButtonText] = useState("");
	const [noticeSecondButtonText, setNoticeSecondButtonText] = useState("");

	const router = useRouter();

	useEffect(() => {
		if (noticeTitle !== "") setNoticeVisible(true);
	}, [noticeTitle]);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (noticeNoButtons === 1) {
			timer = setTimeout(() => {
				hideNotice();
			}, 4000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [noticeVisible]);

	useEffect(() => {
		if (!signedIn) router.push("/signin");
	}, []);

	const hideNotice: Function = () => {
		setNoticeVisible(false);
		setNoticeTitle("");
		setNoticeSubtitle("");
		setNoticeFirstButtonText("");
		setNoticeSecondButtonText("");
	};

	const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		if (
			name === dbUser?.shortName &&
			email === dbUser?.email &&
			emails === dbUser?.emails
		) {
			setNoticeTitle("No changes made");
			setNoticeSubtitle("Make some changes in order to save.");
			setNoticeNoButtons(1);
			setNoticeFirstButtonText("Ok");
		} else {
			setDeleteOrSubmitOrClear("submit");
			setNoticeTitle("");
			setNoticeTitle("Save changes");
			setNoticeSubtitle(
				"Are you sure you want to save these changes to your profile?"
			);
			setNoticeNoButtons(2);
			setNoticeFirstButtonText("Yes");
			setNoticeSecondButtonText("Cancel");
		}
	};

	const deleteHandler: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		setNoticeTitle("");
		setDeleteOrSubmitOrClear("delete");
		setNoticeTitle("Delete your account");
		setNoticeSubtitle(
			"Are you sure you want to permanently delete your account?"
		);
		setNoticeNoButtons(2);
		setNoticeFirstButtonText("Yes");
		setNoticeSecondButtonText("Cancel");
	};

	const submitCallback: Function = async () => {
		setSpinnerVisible(true);
		if (dbUser) {
			setNoticeTitle("");
			const newBody: UserModel = {
				...dbUser,
				shortName: name as string,
				email: email as string,
				emails: emails as boolean,
			};

			try {
				await postUpdatedResourceToDb(newBody);
				if (setDbUser) setDbUser(newBody);
				hideNotice();
				setNoticeTitle("Account successfully updated");
				setNoticeSubtitle("Your changes were succesfully saved.");
				setNoticeNoButtons(1);
				setNoticeFirstButtonText("Ok");
			} catch (error) {
				hideNotice();
				setNoticeTitle("Account not updated");
				setNoticeSubtitle(
					"Something went wrong. Please contact the developer."
				);
				setNoticeNoButtons(1);
				setNoticeFirstButtonText("Ok");
			}
		}
		setSpinnerVisible(false);
	};

	const deleteCallback: Function = async () => {
		setSpinnerVisible(true);
		try {
			await fetch(`/api/users/${dbUser?.userId}`, {
				method: "DELETE",
			});
			hideNotice();
			setNoticeTitle("Account successfully deleted");
			setNoticeSubtitle(
				"Your account and all account data were succesfully deleted."
			);
			setNoticeNoButtons(1);
			setNoticeFirstButtonText("Ok");
			handleSignoutClick();
			if (setSignedIn) setSignedIn(false);
			if (setDbUser) setDbUser(null);
			if (setUser) setUser(null);
			router.push("/signin");
		} catch (error) {
			hideNotice();
			setNoticeTitle("Account not deleted");
			setNoticeSubtitle("Something went wrong. Please contact the developer.");
			setNoticeNoButtons(1);
			setNoticeFirstButtonText("Ok");
		}
		setSpinnerVisible(false);
	};

	const clearWatchHistoryHandler: MouseEventHandler<HTMLButtonElement> = () => {
		setDeleteOrSubmitOrClear("clear");
		hideNotice();
		setNoticeTitle("Clear watch history");
		setNoticeSubtitle("Are you sure you want to clear your watch history?");
		setNoticeNoButtons(2);
		setNoticeFirstButtonText("Yes");
		setNoticeSecondButtonText("Cancel");
	};

	const clearWatchHistory: Function = async () => {
		setSpinnerVisible(true);
		if (dbUser) {
			const newBody: UserModel = {
				...dbUser,
				watchhistory: [],
			};

			try {
				await postUpdatedResourceToDb(newBody);
				if (setDbUser) setDbUser(newBody);
				hideNotice();
				setNoticeTitle("Watch history cleared");
				setNoticeSubtitle("Your watch history has been cleared.");
				setNoticeNoButtons(1);
				setNoticeFirstButtonText("Ok");
			} catch (error) {
				hideNotice();
				setNoticeTitle("Watch history not cleared");
				setNoticeSubtitle(
					"Something went wrong. Please contact the developer."
				);
				setNoticeNoButtons(1);
				setNoticeFirstButtonText("Ok");
			}
		}
		setSpinnerVisible(false);
	};

	const clearVideoFromWatchHistory: MouseEventHandler<HTMLButtonElement> | any =
		async (id: string) => {
			setSpinnerVisible(true);
			if (dbUser) {
				const newBody: UserModel = {
					...dbUser,
					watchhistory: dbUser.watchhistory.filter((item) => item.id !== id),
				};
				try {
					await postUpdatedResourceToDb(newBody);
					if (setDbUser) setDbUser(newBody);

					hideNotice();
					setNoticeTitle("Video deleted");
					setNoticeSubtitle("The video has been deleted from your history");
					setNoticeNoButtons(1);
					setNoticeFirstButtonText("Ok");
				} catch (error) {
					hideNotice();
					setNoticeTitle("Video not deleted");
					setNoticeSubtitle(
						"Something went wrong. Please contact the developer."
					);
					setNoticeNoButtons(1);
					setNoticeFirstButtonText("Ok");
				}
			}
			setSpinnerVisible(false);
		};

	return (
		<main className="main center">
			<Notice
				visible={noticeVisible}
				setVisible={setNoticeVisible}
				title={noticeTitle}
				subtitle={noticeSubtitle}
				noButtons={noticeNoButtons}
				firstButtonText={noticeFirstButtonText}
				secondButtonText={noticeSecondButtonText}
				confirmCallback={
					deleteOrSubmitOrClear === "delete"
						? deleteCallback
						: deleteOrSubmitOrClear === "clear"
						? clearWatchHistory
						: submitCallback
				}
				cancelCallback={hideNotice}
			/>
			<section className="account">
				<h1 className="title">Account</h1>
				<div className="head">
					<img src={dbUser?.photoUrl} alt={dbUser?.name} />
					<h1 className="name">{dbUser?.name}</h1>
				</div>
				<form className="form" onSubmit={submitHandler} onReset={deleteHandler}>
					<div className="input-group">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							id="name"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="input-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="input-group">
						<label htmlFor="emailPref">
							Want to receive email notifications?
						</label>
						<input
							type="checkbox"
							id="emailPref"
							checked={emails}
							onChange={(e) => setEmails(e.target.checked)}
						/>
					</div>
					<div className="input-group">
						<button type="submit">Save</button>
						<button type="reset">Delete your account</button>
					</div>
				</form>
			</section>

			{dbUser?.watchhistory.length !== 0 && (
				<section className="history">
					<h1 className="title">Watch History</h1>
					<div className="results">
						{dbUser?.watchhistory.map((item) => (
							<HistoryResult
								clearVideo={clearVideoFromWatchHistory}
								item={item}
								key={item.id}
							/>
						))}
					</div>

					<button className="clear" onClick={clearWatchHistoryHandler}>
						Clear Watch History
					</button>
				</section>
			)}
			{spinnerVisible && <Spinner />}
		</main>
	);
};

export default Profile;
