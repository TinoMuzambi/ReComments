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

const Profile: React.FC = (): JSX.Element => {
	const { dbUser, signedIn, setSignedIn, setDbUser, setUser } =
		useContext(AppContext);
	const [name, setName] = useState(dbUser?.shortName);
	const [email, setEmail] = useState(dbUser?.email);
	const [emails, setEmails] = useState<boolean | undefined>(dbUser?.emails);
	const [deleteOrSubmitOrClear, setDeleteOrSubmitOrClear] = useState<
		"delete" | "submit" | "clear"
	>("submit");

	const [noticeVisible, setNoticeVisible] = useState<boolean>(false);
	const [noticeNoButtons, setNoticeNoButtons] = useState<1 | 2>(1);
	const [noticeTitle, setNoticeTitle] = useState("");
	const [noticeSubtitle, setNoticeSubtitle] = useState("");
	const [noticeFirstButtonText, setNoticeFirstButtonText] = useState("");
	const [noticeSecondButtonText, setNoticeSecondButtonText] = useState("");

	const router = useRouter();

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (noticeTitle !== "") {
			setNoticeVisible(true);
			if (noticeNoButtons === 1) {
				timer = setTimeout(() => {
					setNoticeVisible(false);
				}, 4000);
			}
		} else setNoticeVisible(false);
		return () => {
			clearTimeout(timer);
		};
	}, [noticeTitle]);

	useEffect(() => {
		if (!signedIn) router.push("/signin");
		if (dbUser?.photoUrl) {
			let root = document.documentElement;

			if (root)
				root.style.setProperty("--url", "url(" + dbUser?.photoUrl + ")");
		}
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

		setDeleteOrSubmitOrClear("submit");
		setNoticeTitle("Save changes");
		setNoticeSubtitle(
			"Are you sure you want to save these changes to your profile?"
		);
		setNoticeNoButtons(2);
		setNoticeFirstButtonText("Yes");
		setNoticeSecondButtonText("Cancel");
	};

	const deleteHandler: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

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
		if (dbUser) {
			setNoticeTitle("");
			const body: UserModel = {
				...dbUser,
				shortName: name as string,
				email: email as string,
				emails: emails as boolean,
			};

			try {
				await postUpdatedResourceToDb(body);
				setNoticeTitle("Account successfully updated");
				setNoticeSubtitle("Your changes were succesfully saved.");
				setNoticeNoButtons(1);
				setNoticeFirstButtonText("Ok");
			} catch (error) {
				setNoticeTitle("Account not updated");
				setNoticeSubtitle(
					"Something went wrong. Please contact the developer."
				);
				setNoticeNoButtons(1);
				setNoticeFirstButtonText("Ok");
			}
		}
	};

	const deleteCallback: Function = async () => {
		try {
			await fetch(`/api/users/${dbUser?.userId}`, {
				method: "DELETE",
			});
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
			setNoticeTitle("Account not deleted");
			setNoticeSubtitle("Something went wrong. Please contact the developer.");
			setNoticeNoButtons(1);
			setNoticeFirstButtonText("Ok");
		}
	};

	const clearWatchHistoryHandler: MouseEventHandler<HTMLButtonElement> = () => {
		setDeleteOrSubmitOrClear("clear");
		setNoticeTitle("Clear watch history");
		setNoticeSubtitle("Are you sure you want to clear your watch history?");
		setNoticeNoButtons(2);
		setNoticeFirstButtonText("Yes");
		setNoticeSecondButtonText("Cancel");
	};

	const clearWatchHistory: Function = async () => {
		if (dbUser) {
			const newBody: UserModel = {
				...dbUser,
				watchhistory: [],
			};

			try {
				await postUpdatedResourceToDb(newBody);
				if (setDbUser) setDbUser(newBody);
				setNoticeTitle("Watch history cleared");
				setNoticeSubtitle("Your watch history has been cleared.");
				setNoticeNoButtons(1);
				setNoticeFirstButtonText("Ok");
			} catch (error) {
				setNoticeTitle("Watch history not cleared");
				setNoticeSubtitle(
					"Something went wrong. Please contact the developer."
				);
				setNoticeNoButtons(1);
				setNoticeFirstButtonText("Ok");
			}
		}
	};

	return (
		<main className="main center">
			<Notice
				visible={noticeVisible}
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

			<section className="history">
				<h1 className="title">Watch History</h1>

				<div className="results">
					{dbUser?.watchhistory.map((item) => (
						<HistoryResult item={item} key={item.id} />
					))}
				</div>

				<button className="clear" onClick={clearWatchHistoryHandler}>
					Clear Watch History
				</button>
			</section>
		</main>
	);
};

export default Profile;
