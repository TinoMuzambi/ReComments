import { MouseEventHandler, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { handleSignoutClick } from "../utils/gapi";

const Nav: React.FC = (): JSX.Element => {
	const [navOpen, setNavOpen] = useState(false);

	const { setSignedIn, setUser, user, signedIn, setDbUser } =
		useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		// Hide navigation on route change.
		const handleRouteChange = () => {
			setNavOpen(false);
		};

		router.events.on("routeChangeStart", handleRouteChange);

		return () => {
			router.events.off("routeChangeStart", handleRouteChange);
		};
	}, []);

	const handleSignOut: MouseEventHandler<HTMLLIElement> = () => {
		if (setSignedIn) {
			router.push("/signin");
			setSignedIn(false);
			if (setUser) setUser(null);
			if (setDbUser) setDbUser(null);
		}
		handleSignoutClick();
	};

	return (
		<header className="nav-header">
			<nav className={`nav ${navOpen && "open"}`}>
				<ul className={`links ${navOpen && "open"}`}>
					<div className="row">
						<div className="logo-holder">
							<Link href="/">
								<a className="link">
									<h1 className="logo">R</h1>
								</a>
							</Link>
						</div>
						<div
							className={`burger ${navOpen && "open"}`}
							onClick={() => setNavOpen(!navOpen)}
						>
							<div className="top"></div>
							<div className="middle"></div>
							<div className="bottom"></div>
						</div>
					</div>
					<div className={`links-holder ${navOpen && "open"}`}>
						<Link href="/">
							<a className="link">Home</a>
						</Link>
						{signedIn && (
							<Link href="/search">
								<a className="link">Search</a>
							</Link>
						)}
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
