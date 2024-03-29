import Link from "next/link";
import moment from "moment";
import { IoCloseCircle } from "react-icons/io5";

import { HistoryResultProps } from "../interfaces";

const HistoryResult: React.FC<HistoryResultProps> = ({ item, clearVideo }) => {
	return (
		<div className="item">
			<Link href={`/video/${item.id}`}>
				<a>
					<img src={item.thumbnail} alt={item.title} />
				</a>
			</Link>
			<div className="flex">
				<Link href={`/video/${item.id}`}>
					<a>
						<h3 className="name">{item.title}</h3>
					</a>
				</Link>

				<div className="wrapper">
					<IoCloseCircle
						className="icon"
						onClick={() => clearVideo(item.id)}
						role="button"
					/>
				</div>
			</div>
			<Link href={`/video/${item.id}`}>
				<a>
					<h5 className="uploader">{item.uploader}</h5>
					<h6
						className="date"
						title={moment(item.date).format("MMMM Do YYYY, h:mm:ss a")}
					>
						You watched this {moment(item.date).fromNow()}
					</h6>
				</a>
			</Link>
		</div>
	);
};

export default HistoryResult;
