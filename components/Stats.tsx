import { useState } from "react";
import parse from "html-react-parser";
import Autolinker from "autolinker";
import { BiLike } from "react-icons/bi";
import { VscEye } from "react-icons/vsc";
import { MdDateRange } from "react-icons/md";
import moment from "moment";

import { StatsProps } from "../interfaces";
import { numberWithCommas } from "../utils";
import { IconType } from "react-icons/lib";

const Stats: React.FC<StatsProps> = ({ result }): JSX.Element => {
	const [descVisible, setDescVisible] = useState(false);
	console.log(result);

	const getStat: Function = (
		i: number,
		icon: IconType,
		num: Number,
		date?: Date
	): JSX.Element => (
		<div className="stat" key={i}>
			<span className="icon">{icon}</span>
			<p className="text">
				{date ? moment(date).format("MMMM Do YYYY") : numberWithCommas(num)}
			</p>
		</div>
	);

	const stats = [
		{
			icon: <VscEye />,
			stat: result.statistics ? result.statistics.viewCount : 0,
		},
		{
			icon: <BiLike />,
			stat: result.statistics ? result.statistics.likeCount : 0,
		},
		{
			icon: <MdDateRange />,
			stat: null,
			date: result.snippet?.publishedAt && result.snippet.publishedAt,
		},
	];

	return (
		<>
			<div className="stats">
				{stats.map((item, i) => getStat(i, item.icon, item.stat, item?.date))}
			</div>
			<h3 className="uploader">
				{result.snippet ? result.snippet.channelTitle : "Title"}
			</h3>
			<p className={`desc ${descVisible && "full"}`}>
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
			<button className="more" onClick={() => setDescVisible(!descVisible)}>
				Show {descVisible ? "Less" : "More"}
			</button>
		</>
	);
};

export default Stats;
