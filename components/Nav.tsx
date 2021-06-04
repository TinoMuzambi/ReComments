import { useContext } from "react";
import Link from "next/link";

import { AppContext } from "../context/AppContext";
import { handleSignoutClick } from "../utils/gapi";

const Nav: React.FC = () => {
	const { setSignedIn, setUser, user, signedIn } = useContext(AppContext);

	const handleSignOut = () => {
		if (setSignedIn) {
			setSignedIn(false);
			if (setUser) setUser(null);
		}
		handleSignoutClick();
	};

	return (
		<header className="nav-header">
			<nav className="nav">
				<ul className="links">
					<h1 className="logo">R</h1>
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
				</ul>
			</nav>
		</header>
	);
};

export default Nav;
