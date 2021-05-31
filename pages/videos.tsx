import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";

const Videos = () => {
	const { signedIn } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/");
	}, [signedIn]);

	return (
		<>
			<header>
				<nav className="nav">
					<ul className="links">
						<li className="link">Home</li>
						<li className="link">Sign Out</li>
						<li className="link">GitHub</li>
					</ul>
				</nav>
			</header>
			<main className="container">
				<section className="form-holder">
					<form className="form">
						<input type="url" placeholder="Enter YouTube video url" required />
						<button type="submit">Search</button>
					</form>
				</section>
			</main>
		</>
	);
};

export default Videos;
