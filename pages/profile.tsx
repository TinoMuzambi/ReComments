import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { useState } from "react";

const Profile: React.FC = (): JSX.Element => {
	const { dbUser, signedIn } = useContext(AppContext);
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
			<form className="form">
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
						required
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
