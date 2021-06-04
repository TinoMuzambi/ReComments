import { useContext } from "react";
import Link from "next/link";

import { AppContext } from "../context/AppContext";
import { handleSignoutClick } from "../utils/gapi";

const Nav: React.FC = () => {
	const { setSignedIn, signedIn } = useContext(AppContext);

	return (
		<header className="nav-header">
			<nav className="nav">
				<ul className="links">
					<h1 className="logo">R</h1>
					<Link href="/">
						<a className="link">Home</a>
					</Link>
					<li className="link" onClick={handleSignoutClick}>
						Sign Out
					</li>
					{/* <Link href="/">
						<a className="link">GitHub</a>
					</Link> */}
				</ul>
			</nav>
		</header>
	);
};

export default Nav;
