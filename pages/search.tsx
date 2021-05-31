import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import Meta from "../components/Meta";
import { AppContext } from "../context/AppContext";
import { execute } from "../utils/gapi";

const Videos = () => {
	const [results, setResults] = useState([]);
	const [url, setUrl] = useState("");

	const { signedIn } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/");
	}, [signedIn]);

	return (
		<>
			<Meta
				title=" Search | ReComments"
				description="Search for a YouTube video and get to chatting in the comments!"
				url="https://re-comments.vercel.app/search"
			/>
			<header className="search-header">
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
				{results.length > 0 && (
					<section className="results">
						<h1 className="title">Search Results</h1>
						{results.map((result) => (
							<div className="result" key={result.id}>
								<div className="result">
									<img
										src={result.snippet.thumbnails.high.url}
										alt="title"
										className="thumbnail"
									/>
									<div className="details">
										<h2 className="name">{result.snippet.title}</h2>
										<h3 className="uploader">{result.snippet.channelTitle}</h3>
										<h5>
											Uploaded on{" "}
											{new Date(
												result.snippet.publishedAt
											).toLocaleDateString()}
										</h5>
									</div>
								</div>
							</div>
						))}
					</section>
				)}
			</main>
		</>
	);
};

export default Videos;
