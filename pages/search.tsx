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
import { shuffle } from "../utils";

const Search: React.FC = (): JSX.Element => {
	const [searchInput, setSearchInput] = useState("");
	const [isFetchingData, setIsFetchingData] = useState(false);
	const [noResultsFound, setNoResultsFound] = useState(false);
	const [useBlockFormat, setUseBlockFormat] = useState(false);

	const { signedIn, searchResults, setSearchResults } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/");
	}, [signedIn]);

	useEffect(() => {
		if (!searchInput) {
			try {
				setUseBlockFormat(true);
				setIsFetchingData(true);
				const makeCall = async () => {
					await loadClient();
					execute(
						true,
						searchInput,
						true,
						setSearchResults,
						setIsFetchingData,
						setNoResultsFound
					);
				};
				makeCall();
			} catch (error) {
				console.error(error);
			}
		}
	}, []);

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e: FormEvent) => {
		e.preventDefault();
		setIsFetchingData(true);
		setUseBlockFormat(false);
		const makeCall = async () => {
			await loadClient();
			execute(
				false,
				searchInput,
				true,
				setSearchResults,
				setIsFetchingData,
				setNoResultsFound
			);
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
						{shuffle(searchResults).map((result: gapi.client.youtube.Video) => (
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
		</>
	);
};

export default Search;
