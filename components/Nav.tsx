import { MouseEventHandler, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoMdMoon, IoMdSunny } from "react-icons/io";

import { AppContext } from "../context/AppContext";
import { handleSignoutClick } from "../utils/gapi";
import { UserModel } from "../interfaces";
import { postUpdatedResourceToDb, ROLES } from "../utils";

const Nav: React.FC = (): JSX.Element => {
	const [navOpen, setNavOpen] = useState(false);
	const [dark, setDark] = useState(false);

	const { setSignedIn, setUser, dbUser, signedIn, setDbUser } =
		useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		// Check and set dark mode preference.
		if (dbUser?.darkMode) {
			setDark(dbUser?.darkMode);
			if (dbUser?.darkMode) document.body.classList.add("dark");
			else document.body.classList.remove("dark");
		}
	}, [dbUser]);

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

	const toggleDarkMode: MouseEventHandler<HTMLButtonElement> = async () => {
		let updatedUser: UserModel = { ...(dbUser as UserModel) };
		if (dark) {
			document.body.classList.remove("dark");
			updatedUser.darkMode = false;
		} else {
			document.body.classList.add("dark");
			updatedUser.darkMode = true;
		}
		await postUpdatedResourceToDb(updatedUser);
		setDark(!dark);
	};

	const handleSignOut: MouseEventHandler<HTMLLIElement> = () => {
		// Reset context.
		if (setSignedIn) {
			router.push("/signin");
			setSignedIn(false);
			if (setUser) setUser(null);
			if (setDbUser) setDbUser(null);
		}

		// Gapi sign out.
		handleSignoutClick();

		// Revert to light mode.
		setDark(false);
		document.body.classList.remove("dark");
	};

	return (
		<>
			{signedIn && (
				<button
					data-dark={dark ? "Turn on light mode" : "Turn on dark mode"}
					className="toggle"
					onClick={toggleDarkMode}
				>
					{dark ? (
						<IoMdSunny className="icon" />
					) : (
						<IoMdMoon className="icon" />
					)}
				</button>
			)}
			<header className="nav-header">
				<nav className={`nav ${navOpen && "open"}`}>
					<ul className={`links ${navOpen && "open"}`}>
						<div className="row">
							<li className="logo-holder">
								<Link href="/search">
									<a className="link">
										<h1 className="logo">R</h1>
									</a>
								</Link>
							</li>
							<li
								className={`burger ${navOpen && "open"}`}
								onClick={() => setNavOpen(!navOpen)}
							>
								<div className="top"></div>
								<div className="middle"></div>
								<div className="bottom"></div>
							</li>
						</div>
						<div className={`links-holder ${navOpen && "open"}`}>
							{signedIn && (
								<Link href="/search">
									<li>
										<a className="link">Home</a>
									</li>
								</Link>
							)}
							<Link href="/">
								<li>
									<a className="link">About</a>
								</li>
							</Link>
							{signedIn && (
								<li className="link" onClick={handleSignOut}>
									Sign Out
								</li>
							)}
							{dbUser && (
								<>
									{dbUser.role !== ROLES.standard && (
										<Link href="/admin">
											<li>
												<a className="link">Admin</a>
											</li>
										</Link>
									)}
									<Link href="/profile">
										<li>
											<a className="link">
												<div className="profile">
													<img
														className="photo"
														src={dbUser.photoUrl}
														alt={dbUser.shortName}
													/>
													<p className="name">{dbUser.shortName}</p>
												</div>
											</a>
										</li>
									</Link>
								</>
							)}
						</div>
					</ul>
				</nav>
			</header>
		</>
	);
};

export default Nav;
