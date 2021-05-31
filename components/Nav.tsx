import { useContext } from "react";
import Link from "next/link";

import { AppContext } from "../context/AppContext";

const Nav = () => {
	const { setSignedIn, signedIn } = useContext(AppContext);

	return (
		<header className="search-header">
			<nav className="nav">
				<ul className="links">
					<Link href="/">
						<a className="link">Home</a>
					</Link>
					<li
						className="link"
						onClick={() => {
							if (signedIn) {
								if (setSignedIn) setSignedIn(false);
							}
						}}
					>
						Sign Out
					</li>
					<Link href="/">
						<a className="link">GitHub</a>
					</Link>
				</ul>
			</nav>
		</header>
	);
};

export default Nav;
