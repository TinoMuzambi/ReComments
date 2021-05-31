import Link from "next/link";

const Nav = () => {
	return (
		<header className="search-header">
			<nav className="nav">
				<ul className="links">
					<Link href="/">
						<a className="link">Home</a>
					</Link>
					<Link href="/">
						<a className="link">Sign Out</a>
					</Link>
					<Link href="/">
						<a className="link">GitHub</a>
					</Link>
				</ul>
			</nav>
		</header>
	);
};

export default Nav;
