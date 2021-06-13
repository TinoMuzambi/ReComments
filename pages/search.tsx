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
	const [urlInput, setUrlInput] = useState("");
	const [isFetchingData, setIsFetchingData] = useState(false);
	const [noResultsFound, setNoResultsFound] = useState(false);

	const { signedIn } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/");
	}, [signedIn]);

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e: FormEvent) => {
		e.preventDefault();
		setIsFetchingData(true);
		const makeCall = async () => {
			await loadClient();
			execute(urlInput, true, setResults, setIsFetchingData, setNoResultsFound);
		};
		makeCall();
	};

	return (
		<>
			<Meta
				title=" Search | ReComments"
				description="Search for a YouTube video and get to chatting in the comments!"
				url="https://recomments.tinomuzambi.com/search"
			/>

			<main className="container">
				<section className="form-holder">
					<Form
						handleSubmit={handleSubmit}
						url={urlInput}
						setUrl={setUrlInput}
					/>
				</section>
				{isFetchingData && <Loader />}
				{noResultsFound && !isFetchingData && (
					<AppState message="No results found!" />
				)}
				{results.length > 0 && !isFetchingData && (
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
