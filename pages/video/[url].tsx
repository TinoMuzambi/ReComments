import { /*GetStaticProps, GetStaticPaths,*/ GetServerSideProps } from "next";
import parse from "html-react-parser";

import { VideoProps } from "../../interfaces";
import Meta from "../../components/Meta";

const Video = ({
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
}: VideoProps) => {
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
					<p className="stat">{views}</p>
					<p className="stat">{likes}</p>
					<p className="stat">{dislikes}</p>
					<p className="stat">{new Date(date).toLocaleDateString()}</p>
				</div>
				<h3 className="uploader">{channel}</h3>
				<p className="desc">{description}</p>
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
