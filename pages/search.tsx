import {
	FormEvent,
	FormEventHandler,
	useContext,
	useEffect,
	useState,
} from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { AppContext } from "../context/AppContext";
import Meta from "../components/Meta";
import Loader from "../components/Loader";
import Result from "../components/Result";
import Form from "../components/Form";
import AppState from "../components/AppState";
import { loadClient, execute } from "../utils/gapi";

const Search: React.FC = () => {
	const [results, setResults] = useState<gapi.client.youtube.Video[]>([]);
	const [url, setUrl] = useState("");
	const [fetching, setFetching] = useState(false);
	const [noResults, setNoResults] = useState(false);

	const { signedIn } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/");
	}, [signedIn]);

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e: FormEvent) => {
		e.preventDefault();
		setFetching(true);
		const makeCall = async () => {
			await loadClient();
			execute(url, true, setResults, setFetching, setNoResults);
		};
		makeCall();
	};

	return (
		<>
			<Meta
				title=" Search | ReComments"
				description="Search for a YouTube video and get to chatting in the comments!"
				url="https://re-comments.vercel.app/search"
			/>

			<main className="container">
				<section className="form-holder">
					<Form handleSubmit={handleSubmit} url={url} setUrl={setUrl} />
				</section>
				{fetching && <Loader />}
				{noResults && !fetching && <AppState message="No results found!" />}
				{results.length > 0 && !fetching && (
					<section className="results">
						{results.map((result) => (
							<Link
								key={result.id}
								href={{
									pathname: `/video/${result.id}`,
								}}
							>
								<a>
									<Result result={result} />
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
