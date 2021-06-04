import parse from "html-react-parser";
import Autolinker from "autolinker";
import { BiLike, BiDislike } from "react-icons/bi";
import { VscEye } from "react-icons/vsc";
import { MdDateRange } from "react-icons/md";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { VideoProps } from "../../interfaces";
import Meta from "../../components/Meta";
import { loadClient, execute } from "../../utils/gapi";

const Video: React.FC = () => {
	const [result, setResult] = useState<VideoProps[]>();
	const router = useRouter();

	useEffect(() => {
		const getRes: Function = async () => {
			const url = router.query.url as string;

			try {
				await loadClient();
				await execute(url, false, (res: any) => {
					setResult(res);
				});
			} catch (error) {
				router.push("/search");
			}
		};
		getRes();
	}, []);

	if (!result)
		return (
			<main className="main">
				<div className="error-holder">
					<img
						src="https://a.storyblok.com/f/114267/1222x923/8898eb61f4/error.png"
						alt="error"
						className="error-image"
					/>
					<h1 className="error">Loading...</h1>
				</div>
			</main>
		);
	return (
		<>
			<Meta
				title={`${result[0].snippet.title} | ReComments`}
				description={`Comment on '${result[0].snippet.title}' from ${result[0].snippet.channelTitle} on ReComments!`}
				url={`https://re-comments.vercel.app/video/${result[0].id}`}
			/>
			<main className="video-holder">
				<h1 className="title">{result[0].snippet.title}</h1>
				{result[0].status.embeddable ? (
					<div className="player">{parse(result[0].player.embedHtml)}</div>
				) : (
					<div className="player">
						<img
							src={result[0].snippet.thumbnails.maxres.url}
							alt={result[0].snippet.title}
							className="thumbnail"
						/>
					</div>
				)}
				<div className="stats">
					<div className="stat">
						<span className="icon">
							<VscEye />
						</span>
						<p className="text">{result[0].statistics.viewCount}</p>
					</div>
					<div className="stat">
						<span className="icon">
							<BiLike />
						</span>
						<p className="text">{result[0].statistics.likeCount}</p>
					</div>
					<div className="stat">
						<span className="icon">
							<BiDislike />
						</span>{" "}
						<p className="text">{result[0].statistics.dislikeCount}</p>
					</div>
					<div className="stat">
						<span className="icon">
							<MdDateRange />
						</span>{" "}
						<p className="text">
							{new Date(result[0].snippet.publishedAt).toLocaleDateString()}
						</p>
					</div>
				</div>
				<h3 className="uploader">{result[0].snippet.channelTitle}</h3>
				<p className="desc">
					{parse(
						Autolinker.link(result[0].snippet.description as string, {
							className: "embed-link",
						})
					)}
				</p>
			</main>
		</>
	);
};

export default Video;
