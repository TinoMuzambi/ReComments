import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";

import Meta from "../../components/Meta";
import Player from "../../components/Player";
import AppState from "../../components/AppState";
import Stats from "../../components/Stats";
import Comments from "../../components/Comments/Comments";
import { loadClient, execute } from "../../utils/gapi";

const Video: React.FC<any> = ({ dbComments }) => {
	const [result, setResult] = useState<gapi.client.youtube.Video>();
	const router = useRouter();

	useEffect(() => {
		const getRes: Function = async () => {
			const url = router.query.url as string;

			try {
				await loadClient();
				await execute(url, false, (res: any) => {
					setResult(res[0]);
				});
			} catch (error) {
				router.push("/search");
			}
		};
		getRes();
	}, []);

	if (!result) return <AppState message="Loading..." />;

	if (result.snippet && result.status && result.player && result.statistics)
		return (
			<>
				<Meta
					title={`${result.snippet.title} | ReComments`}
					description={`Comment on '${result.snippet.title}' from ${result.snippet.channelTitle} on ReComments!`}
					url={`https://re-comments.vercel.app/video/${result.id}`}
				/>
				<main className="video-holder">
					<h1 className="title">{result.snippet.title}</h1>

					<Player result={result} />

					<Stats result={result} />

					<Comments comments={dbComments} />
				</main>
			</>
		);
	else return <AppState message="Loading..." />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	let res: any;
	if (context && context.params)
		res = await fetch(
			`http://localhost:3000/api/comments/${context.params.url}`
		);
	const comments = await res.json();
	return {
		props: { dbComments: comments.data },
	};
};

export default Video;
