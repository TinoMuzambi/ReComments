import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { handleSignoutClick } from "../utils/gapi";

const Nav: React.FC = () => {
	const { setSignedIn, setUser, user, signedIn, setDbUser } =
		useContext(AppContext);
	const router = useRouter();

	const handleSignOut = () => {
		if (setSignedIn) {
			router.push("/");
			gapi.auth2.getAuthInstance().signOut();
			setSignedIn(false);
			if (setUser) setUser(null);
			if (setDbUser) setDbUser(null);
		}
		handleSignoutClick();
	};

	return (
		<header className="nav-header">
			<nav className="nav">
				<ul className="links">
					<div className="logo-holder">
						<h1 className="logo">R</h1>
					</div>
					<div className="links-holder">
						<Link href="/">
							<a className="link">Home</a>
						</Link>
						{signedIn && (
							<li className="link" onClick={handleSignOut}>
								Sign Out
							</li>
						)}
						{user && user.photos && user.names && (
							<div className="profile">
								<img className="photo" src={user.photos[0].url} alt="Profile" />
								<p className="name">{user.names[0].givenName}</p>
							</div>
						)}
					</div>
				</ul>
			</nav>
		</header>
	);
};

export default Nav;
