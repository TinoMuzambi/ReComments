import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";

const Profile: React.FC = (): JSX.Element => {
	const { dbUser, signedIn } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/signin");
	}, []);
	return (
		<main className="main">
			<div className="head">
				<img src={dbUser?.photoUrl} alt={dbUser?.name} />
				<h1 className="name">{dbUser?.name}</h1>
			</div>
			<form>
				<div className="input-group">
					<label htmlFor="name">Name</label>
					<input type="text" id="name" required />
				</div>
				<div className="input-group">
					<label htmlFor="email">Email</label>
					<input type="email" id="email" required />
				</div>
				<div className="input-group">
					<label htmlFor="emailPref">
						Want to receive email notifications?
					</label>
					<input type="checkbox" id="emailPref" required />
				</div>
				<button type="submit">Save</button>
				<button type="reset">Delete your account</button>
			</form>
		</main>
	);
};

export default Profile;
