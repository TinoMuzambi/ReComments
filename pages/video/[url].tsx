import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { NextPage } from "next";

import Meta from "../../components/Meta";
import Player from "../../components/Player";
import AppState from "../../components/AppState";
import Stats from "../../components/Stats";
import Comments from "../../components/Comments/Comments";
import { loadClient, execute } from "../../utils/gapi";
import { HistoryItem, UserModel, VideoProps } from "../../interfaces";
import { AppContext } from "../../context/AppContext";
import { postUpdatedResourceToDb } from "../../utils";

const Video: NextPage<VideoProps> = ({ dbComments }): JSX.Element => {
	const [result, setResult] = useState<gapi.client.youtube.Video>();

	const router = useRouter();
	const { dbUser, setDbUser } = useContext(AppContext);

	useEffect(() => {
		// Get video data given the url.
		const getRes: Function = async (): Promise<void> => {
			const url = router.query.url as string;

			try {
				await loadClient();
				execute(false, url, false, (res: gapi.client.youtube.Video[]) => {
					setResult(res[0]);
					if (
						res[0] &&
						res[0].snippet?.thumbnails &&
						dbUser &&
						checkHistory(dbUser.watchhistory, res[0].id)
					) {
						const newItem: HistoryItem = {
							id: res[0].id as string,
							title: res[0].snippet?.title as string,
							thumbnail: res[0].snippet?.thumbnails.high?.url as string,
							uploader: res[0].snippet?.channelTitle as string,
							date: new Date(),
						};

						const newBody: UserModel = {
							...dbUser,
							watchhistory: [newItem, ...dbUser.watchhistory],
						};

						const post: Function = async () => {
							try {
								await postUpdatedResourceToDb(newBody);
								if (setDbUser) setDbUser(newBody);
							} catch (error) {}
						};
						post();
					}
				});
			} catch (error) {
				router.push("/search");
			}
		};
		getRes();
	}, []);

	const checkHistory: Function = (
		watchhistory: HistoryItem[],
		id: string
	): boolean => {
		let res = true;
		watchhistory.forEach((item: HistoryItem) => {
			if (item.id === id) res = false;
		});
		return res;
	};

	if (!result) return <AppState message="Loading..." />;

	if (result.snippet && result.status && result.player && result.statistics)
		return (
			<>
				<Meta
					title={`${result.snippet.title} | ReComments`}
					description={`Comment on '${result.snippet.title}' from ${result.snippet.channelTitle} on ReComments!`}
					url={`https://recomments.tinomuzambi.com/video/${result.id}`}
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

Video.getInitialProps = async (req) => {
	const BASE_URL =
		process.env.NODE_ENV === "production"
			? "https://recomments.tinomuzambi.com"
			: "http://localhost:3000";
	let res: any;
	if (req && req.query)
		res = await fetch(`${BASE_URL}/api/comments/video/${req.query.url}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	let comments = await res.json();

	if (!comments.success) comments = [];

	return { dbComments: comments.data || null };
};

export default Video;
