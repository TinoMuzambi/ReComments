import { PlayerProps } from "../interfaces";

const Result: React.FC<PlayerProps> = ({ result }) => {
	return (
		<div className="result">
			<img
				src={
					result.snippet &&
					result.snippet.thumbnails &&
					result.snippet.thumbnails.high
						? result.snippet.thumbnails.high.url
						: ""
				}
				alt="title"
				className="thumbnail"
			/>
			<div className="details">
				<h2 className="name">
					{result.snippet ? result.snippet.title : "Title"}
				</h2>
				<div className="bottom">
					<h3 className="uploader">
						{result.snippet ? result.snippet.channelTitle : "Title"}
					</h3>
					<h5 className="date">
						Uploaded on{" "}
						{result.snippet?.publishedAt &&
							new Date(result.snippet.publishedAt).toLocaleDateString()}
					</h5>
				</div>
			</div>
		</div>
	);
};

export default Result;
