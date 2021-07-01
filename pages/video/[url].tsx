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
import { getDbComments, postUpdatedResourceToDb } from "../../utils";

const Video: NextPage<VideoProps> = ({ dbComments }): JSX.Element => {
	const [result, setResult] = useState<gapi.client.youtube.Video>();

	const router = useRouter();
	const { dbUser, setDbUser, videoComments, setVideoComments } =
		useContext(AppContext);

	useEffect(() => {
		// Get video data given the url.
		const getRes: Function = async (): Promise<void> => {
			const url = router.query.url as string;

			try {
				await loadClient();
				execute(false, url, (res: gapi.client.youtube.Video[]) => {
					setResult(res[0]);
					updateUserHistory(res[0]);
				});
				if (setVideoComments) {
					setVideoComments(dbComments);
				}
			} catch (error) {
				router.push("/search");
			}
		};
		getRes();
	}, []);

	const updateUserHistory: Function = async (
		video: gapi.client.youtube.Video
	): Promise<void> => {
		if (video && video.snippet?.thumbnails && dbUser) {
			let newItem: HistoryItem = {
				id: "",
				title: "",
				thumbnail: "",
				uploader: "",
				date: new Date(),
			};
			const historyCheck = checkHistory(dbUser.watchhistory, video.id);
			if (historyCheck) {
				newItem = {
					id: video.id as string,
					title: video.snippet?.title as string,
					thumbnail: video.snippet?.thumbnails.high?.url as string,
					uploader: video.snippet?.channelTitle as string,
					date: new Date(),
				};
			} else {
				newItem = dbUser.watchhistory.find(
					(item) => item.id === video.id
				) as HistoryItem;
				newItem = { ...newItem, date: new Date() };
			}
			const newBody: UserModel = historyCheck
				? {
						...dbUser,
						watchhistory: [newItem, ...dbUser.watchhistory],
				  }
				: {
						...dbUser,
						watchhistory: [
							newItem,
							...dbUser.watchhistory.filter((item) => item.id !== video.id),
						],
				  };

			try {
				await postUpdatedResourceToDb(newBody);
				if (setDbUser) setDbUser(newBody);
			} catch (error) {}
		}
	};

	const checkHistory: Function = (
		watchhistory: HistoryItem[],
		id: string
	): boolean => {
		// Check if video is already in watch history.
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

					<Comments comments={videoComments || []} />
				</main>
			</>
		);
	else return <AppState message="Loading..." />;
};

Video.getInitialProps = async (req) => {
	let comments;

	if (req && req.query) comments = await getDbComments(req.query.url);

	if (!comments.success) comments = [];

	return { dbComments: comments.data || null };
};

export default Video;
