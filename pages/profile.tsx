import { FormEventHandler, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { useState } from "react";
import { UserModel } from "../interfaces";
import { postUpdatedResourceToDb } from "../utils";
import { handleSignoutClick } from "../utils/gapi";

const Profile: React.FC = (): JSX.Element => {
	const { dbUser, signedIn, setSignedIn, setDbUser, setUser } =
		useContext(AppContext);
	const [photoUrl, setPhotoUrl] = useState(dbUser?.photoUrl);
	const [name, setName] = useState(dbUser?.shortName);
	const [email, setEmail] = useState(dbUser?.email);
	const [emails, setEmails] = useState<boolean | undefined>(dbUser?.emails);

	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/signin");
		if (dbUser?.photoUrl) {
			let root = document.documentElement;

			if (root)
				root.style.setProperty("--url", "url(" + dbUser?.photoUrl + ")");
		}
	}, []);

	const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (dbUser) {
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

	const deleteHandler: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

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