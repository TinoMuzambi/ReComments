import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

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
							execute(url, setResults);
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
				{results && (
					<section className="results">
						<h1 className="title">Search Results</h1>
						<div className="result">
							<img src="/logo19.png" alt="title" />
							<div className="details">
								<h2 className="name">
									Build an Expense Tracker | React Hooks Context API
								</h2>
								<h3 className="uploader">Traversy Media</h3>
								<h5>Date</h5>
							</div>
						</div>
					</section>
				)}
			</main>
		</>
	);
};

export default Videos;
