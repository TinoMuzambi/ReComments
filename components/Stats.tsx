import parse from "html-react-parser";
import Autolinker from "autolinker";
import { BiLike, BiDislike } from "react-icons/bi";
import { VscEye } from "react-icons/vsc";
import { MdDateRange } from "react-icons/md";

const Stats: React.FC<gapi.client.youtube.Video | any> = ({ result }) => {
	return (
		<>
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
		</>
	);
};

export default Stats;
