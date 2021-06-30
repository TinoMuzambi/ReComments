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
import SearchForm from "../components/SearchForm";
import AppState from "../components/AppState";
import Spinner from "../components/Spinner";
import { loadClient, execute } from "../utils/gapi";

const Search: React.FC = (): JSX.Element => {
	const [searchInput, setSearchInput] = useState("");
	const [isFetchingData, setIsFetchingData] = useState(false);
	const [noResultsFound, setNoResultsFound] = useState(false);
	const [useBlockFormat, setUseBlockFormat] = useState(false);
	const [spinnerVisible, setSpinnerVisible] = useState(false);

	const { signedIn, searchResults, setSearchResults } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/signin");
	}, [signedIn]);

	useEffect(() => {
		// Show spinner when transitioning between pages.
		const handleRouteChange = () => {
			setSpinnerVisible(true);
		};
		const handleRouteComplete = () => {
			setSpinnerVisible(false);
		};

		router.events.on("routeChangeStart", handleRouteChange);
		router.events.on("routeChangeComplete", handleRouteComplete);

		return () => {
			router.events.off("routeChangeStart", handleRouteChange);
			router.events.off("routeChangeComplete", handleRouteComplete);
			setSpinnerVisible(false);
		};
	}, []);

	useEffect(() => {
		// Make call for preview videos.
		if (!searchInput) {
			handleSubmit(true);
		}
	}, [searchInput]);

	const handleSubmit: Function = async (
		isHomeVideos: boolean
	): Promise<void> => {
		setIsFetchingData(true);
		setUseBlockFormat(isHomeVideos);

		if (gapi.client) {
			await loadClient();
			execute(
				isHomeVideos,
				searchInput,
				setSearchResults,
				setIsFetchingData,
				setNoResultsFound
			);
		}
	};

	const handleSubmitHandler: FormEventHandler<HTMLFormElement> = (
		e: FormEvent
	) => {
		// Search for given url.
		e.preventDefault();
		handleSubmit(false);
	};

	return (
		<>
			<Meta
				title="Search | ReComments"
				description="Search for a YouTube video and get to chatting in the comments!"
				url="https://recomments.tinomuzambi.com/search"
			/>

			<main className="container">
				<section className="form-holder">
					<SearchForm
						handleSubmit={handleSubmitHandler}
						searchTerm={searchInput}
						setSearchTerm={setSearchInput}
					/>
				</section>
				{isFetchingData && <Loader />}
				{noResultsFound && !isFetchingData && (
					<AppState message="No results found!" />
				)}
				{searchResults && searchResults.length > 0 && !isFetchingData && (
					<section className={`results ${useBlockFormat && "block"}`}>
						{searchResults.map((result: gapi.client.youtube.Video) => (
							<Link
								key={result.id}
								href={{
									pathname: `/video/${result.id}`,
								}}
							>
								<a>
									<Result result={result} blockFormat={useBlockFormat} />
								</a>
							</Link>
						))}
					</section>
				)}
			</main>
			{spinnerVisible && <Spinner />}
		</>
	);
};

export default Search;
