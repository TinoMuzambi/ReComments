import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { execute } from "../utils/gapi";

const Videos = () => {
	const [results, setResults] = useState({});
	const [url, setUrl] = useState("");

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
					<form
						className="form"
						onSubmit={(e) => {
							e.preventDefault();
							execute(url);
						}}
					>
						<input
							type="url"
							placeholder="Enter YouTube video url"
							required
							value={url}
							onChange={(e) => setUrl(e.target.value)}
						/>
						<button type="submit">Search</button>
					</form>
				</section>
			</main>
		</>
	);
};

export default Videos;
