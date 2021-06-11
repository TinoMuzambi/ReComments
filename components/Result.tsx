import { ResultProps } from "../interfaces";

const Result: React.FC<ResultProps> = ({ result }) => {
	return (
		<div className="result">
			<img
				src={
					result.snippet &&
					result.snippet.thumbnails &&
					result.snippet.thumbnails.high
						? result.snippet.thumbnails.high.url
						: "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
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
