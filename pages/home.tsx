import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { AppContext } from "../context/AppContext";
import Meta from "../components/Meta";
import Loader from "../components/Loader";
import Result from "../components/Result";

import AppState from "../components/AppState";
import { loadClient, execute } from "../utils/gapi";

const Home: React.FC = (): JSX.Element => {
	const [result, setResult] = useState<gapi.client.youtube.Video[]>();
	const [isFetchingData, setIsFetchingData] = useState(false);
	const [noResultsFound, setNoResultsFound] = useState(false);

	const { signedIn, searchResults, setSearchResults } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/");
	}, [signedIn]);

	useEffect(() => {
		const getRes: Function = async (): Promise<void> => {
			const url = router.query.url as string;

			try {
				await loadClient();
				execute(true, url, false, (res: gapi.client.youtube.Video[]) => {
					setResult(res);
				});
			} catch (error) {
				console.log(error);
				router.push("/search");
			}
		};
		getRes();
	}, []);

	return (
		<>
			<Meta
				title=" Search | ReComments"
				description="Search for a YouTube video and get to chatting in the comments!"
				url="https://recomments.tinomuzambi.com/search"
			/>

			<main className="container">
				{isFetchingData && <Loader />}
				{noResultsFound && !isFetchingData && (
					<AppState message="No results found!" />
				)}
				{searchResults && searchResults.length > 0 && !isFetchingData && (
					<section className="results">
						{searchResults.map((result) => (
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

export default Home;
