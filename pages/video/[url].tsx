import { /*GetStaticProps, GetStaticPaths,*/ GetServerSideProps } from "next";
import parse from "html-react-parser";
import Autolinker from "autolinker";
import { BiLike, BiDislike } from "react-icons/bi";
import { VscEye } from "react-icons/vsc";
import { MdDateRange } from "react-icons/md";

import { VideoProps } from "../../interfaces";
import Meta from "../../components/Meta";

const Video: React.FC<VideoProps> = ({
	title,
	id,
	date,
	description,
	channel,
	thumbnail,
	embeddable,
	views,
	likes,
	dislikes,
	html,
}) => {
	return (
		<>
			<Meta
				title={`${title} | ReComments`}
				description={`Comment on '${title}' from ${channel} on ReComments!`}
				url={`https://re-comments.vercel.app/video/${id}`}
			/>
			<main className="video-holder">
				<h1 className="title">{title}</h1>
				{embeddable ? (
					<div className="player">{parse(html)}</div>
				) : (
					<div className="player">
						<img src={thumbnail} alt={title} className="thumbnail" />
					</div>
				)}
				<div className="stats">
					<div className="stat">
						<span className="icon">
							<VscEye />
						</span>
						<p className="text">{views}</p>
					</div>
					<div className="stat">
						<span className="icon">
							<BiLike />
						</span>
						<p className="text">{likes}</p>
					</div>
					<div className="stat">
						<span className="icon">
							<BiDislike />
						</span>{" "}
						<p className="text">{dislikes}</p>
					</div>
					<div className="stat">
						<span className="icon">
							<MdDateRange />
						</span>{" "}
						<p className="text">{new Date(date).toLocaleDateString()}</p>
					</div>
				</div>
				<h3 className="uploader">{channel}</h3>
				<p className="desc">
					{parse(
						Autolinker.link(description as string, {
							className: "embed-link",
						})
					)}
				</p>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			title: context.query.title,
			id: context.query.id,
			date: context.query.date,
			description: context.query.description,
			channel: context.query.channel,
			thumbnail: context.query.thumbnail,
			embeddable: context.query.embeddable,
			views: context.query.views,
			likes: context.query.likes,
			dislikes: context.query.dislikes,
			html: context.query.html,
		},
	};
};

export default Video;
