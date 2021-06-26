import { FormEventHandler, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { UserModel } from "../interfaces";
import { postUpdatedResourceToDb } from "../utils";
import { handleSignoutClick } from "../utils/gapi";
import Notice from "../components/Notice";

const Profile: React.FC = (): JSX.Element => {
	const { dbUser, signedIn, setSignedIn, setDbUser, setUser } =
		useContext(AppContext);
	const [photoUrl, setPhotoUrl] = useState(dbUser?.photoUrl);
	const [name, setName] = useState(dbUser?.shortName);
	const [email, setEmail] = useState(dbUser?.email);
	const [emails, setEmails] = useState<boolean | undefined>(dbUser?.emails);
	const [deleteOrSubmit, setDeleteOrSubmit] = useState<"delete" | "submit">(
		"submit"
	);

	const [noticeVisible, setNoticeVisible] = useState<boolean>(false);
	const [noticeNoButtons, setNoticeNoButtons] = useState<1 | 2>(1);
	const [noticeTitle, setNoticeTitle] = useState("");
	const [noticeSubtitle, setNoticeSubtitle] = useState("");
	const [noticeFirstButtonText, setNoticeFirstButtonText] = useState("");
	const [noticeSecondButtonText, setNoticeSecondButtonText] = useState("");

	const router = useRouter();

	useEffect(() => {
		if (noticeTitle !== "") setNoticeVisible(true);
		else setNoticeVisible(false);
	}, [noticeTitle]);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (noticeNoButtons === 1) {
			if (noticeVisible) {
				timer = setTimeout(() => {
					setNoticeVisible(false);
					setNoticeTitle("");
				}, 4000);
			}
		}
		return () => {
			clearTimeout(timer);
		};
	}, [noticeVisible]);

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

		setDeleteOrSubmit("submit");
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

		setDeleteOrSubmit("delete");
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
				console.log("done");
			} catch (error) {
				console.error(error);
			}
		}
	};

	const deleteCallback: Function = async () => {
		try {
			await fetch(`/api/users/${dbUser?.userId}`, {
				method: "DELETE",
			});
			handleSignoutClick();
			if (setSignedIn) setSignedIn(false);
			if (setDbUser) setDbUser(null);
			if (setUser) setUser(null);
			router.push("/signin");
		} catch (error) {}
	};

	return (
		<main className="main">
			<Notice
				visible={noticeVisible}
				title={noticeTitle}
				subtitle={noticeSubtitle}
				noButtons={noticeNoButtons}
				firstButtonText={noticeFirstButtonText}
				secondButtonText={noticeSecondButtonText}
				confirmCallback={
					deleteOrSubmit === "delete" ? deleteCallback : submitCallback
				}
				cancelCallback={hideNotice}
			/>
			<div className="head">
				<input
					type="file"
					accept="image/*"
					onChange={(e) => console.log(e.target.files)}
				/>
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
		</main>
	);
};

export default Profile;
