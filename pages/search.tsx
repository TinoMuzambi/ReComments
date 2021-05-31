import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Meta from "../components/Meta";
import Loader from "../components/Loader";
import { AppContext } from "../context/AppContext";
import { execute } from "../utils/gapi";

const Search = () => {
	const [results, setResults] = useState([]);
	const [url, setUrl] = useState("");
	const [fetching, setFetching] = useState(false);
	const [noResults, setNoResults] = useState(false);

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

			<main className="container">
				<section className="form-holder">
					<form
						className="form"
						onSubmit={(e) => {
							e.preventDefault();
							setFetching(true);
							execute(url, setResults, setFetching, setNoResults);
						}}
					>
						<input
							type="url"
							placeholder="Enter YouTube video url"
							required
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							className="url"
						/>
						<button type="submit" className="submit">
							Search
						</button>
					</form>
				</section>
				{fetching && <Loader />}
				{noResults && (
					<div className="error-holder">
						<h1 className="error">No results found!</h1>
					</div>
				)}
				{results.length > 0 && (
					<section className="results">
						<h1 className="title">Search Results</h1>
						{results.map((result) => (
							<Link
								key={result.id}
								href={{
									pathname: `/video/${result.id}`,
									query: {
										id: result.id,
										title: result.snippet.title,
										date: result.snippet.publishedAt,
										description: result.snippet.description,
										channel: result.snippet.channelTitle,
										thumbnail: result.snippet.thumbnails.maxres.url,
										embeddable: result.status.embeddable === "true",
										views: Number.parseInt(result.statistics.viewCount),
										likes: Number.parseInt(result.statistics.likeCount),
										dislikes: Number.parseInt(result.statistics.dislikeCount),
										html: result.player.embedHtml,
									},
								}}
							>
								<a>
									<div className="result">
										<div className="result">
											<img
												src={result.snippet.thumbnails.high.url}
												alt="title"
												className="thumbnail"
											/>
											<div className="details">
												<h2 className="name">{result.snippet.title}</h2>
												<div className="bottom">
													<h3 className="uploader">
														{result.snippet.channelTitle}
													</h3>
													<h5 className="date">
														Uploaded on{" "}
														{new Date(
															result.snippet.publishedAt
														).toLocaleDateString()}
													</h5>
												</div>
											</div>
										</div>
									</div>
								</a>
							</Link>
						))}
					</section>
				)}
			</main>
		</>
	);
};

export default Search;
