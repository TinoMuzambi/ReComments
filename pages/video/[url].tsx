import parse from "html-react-parser";
import Autolinker from "autolinker";
import { BiLike, BiDislike } from "react-icons/bi";
import { VscEye } from "react-icons/vsc";
import { MdDateRange } from "react-icons/md";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Meta from "../../components/Meta";
import { loadClient, execute } from "../../utils/gapi";

const Video: React.FC = () => {
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
					{result.status.embeddable ? (
						<div className="player">
							{parse(result.player.embedHtml as string)}
						</div>
					) : result.snippet.thumbnails && result.snippet.thumbnails.maxres ? (
						<div className="player">
							<img
								src={result.snippet.thumbnails.maxres.url}
								alt={result.snippet.title}
								className="thumbnail"
							/>
						</div>
					) : (
						<img
							src="https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
							alt={result.snippet.title}
							className="thumbnail"
						/>
					)}
					<div className="stats">
						<div className="stat">
							<span className="icon">
								<VscEye />
							</span>
							<p className="text">{result.statistics.viewCount}</p>
						</div>
						<div className="stat">
							<span className="icon">
								<BiLike />
							</span>
							<p className="text">{result.statistics.likeCount}</p>
						</div>
						<div className="stat">
							<span className="icon">
								<BiDislike />
							</span>{" "}
							<p className="text">{result.statistics.dislikeCount}</p>
						</div>
						<div className="stat">
							<span className="icon">
								<MdDateRange />
							</span>{" "}
							<p className="text">
								{new Date(
									result.snippet.publishedAt as string | number
								).toLocaleDateString()}
							</p>
						</div>
					</div>
					<h3 className="uploader">{result.snippet.channelTitle}</h3>
					<p className="desc">
						{parse(
							Autolinker.link(result.snippet.description as string, {
								className: "embed-link",
							})
						)}
					</p>
				</main>
			</>
		);
	else
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
};

export default Video;
