import parse from "html-react-parser";
import Autolinker from "autolinker";
import { BiLike, BiDislike } from "react-icons/bi";
import { VscEye } from "react-icons/vsc";
import { MdDateRange } from "react-icons/md";

import { StatsProps } from "../interfaces";

const Stats: React.FC<StatsProps> = ({ result }) => {
	return (
		<>
			<div className="stats">
				<div className="stat">
					<span className="icon">
						<VscEye />
					</span>
					<p className="text">
						{result.statistics ? result.statistics.viewCount : 0}
					</p>
				</div>
				<div className="stat">
					<span className="icon">
						<BiLike />
					</span>
					<p className="text">
						{result.statistics ? result.statistics.likeCount : 0}
					</p>
				</div>
				<div className="stat">
					<span className="icon">
						<BiDislike />
					</span>{" "}
					<p className="text">
						{result.statistics ? result.statistics.dislikeCount : 0}
					</p>
				</div>
				<div className="stat">
					<span className="icon">
						<MdDateRange />
					</span>{" "}
					<p className="text">
						{result.snippet?.publishedAt &&
							new Date(result.snippet.publishedAt).toLocaleDateString()}
					</p>
				</div>
			</div>
			<h3 className="uploader">
				{result.snippet ? result.snippet.channelTitle : "Title"}
			</h3>
			<p className="desc">
				{parse(
					Autolinker.link(
						result.snippet
							? (result.snippet.description as string)
							: "Description",
						{
							className: "embed-link",
						}
					)
				)}
			</p>
		</>
	);
};

export default Stats;
