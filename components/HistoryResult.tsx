import Link from "next/link";
import moment from "moment";
import { HistoryItem } from "../interfaces";

const HistoryResult: React.FC<{ item: HistoryItem }> = ({ item }) => {
	return (
		<Link href={`/video/${item.id}`}>
			<a>
				<div className="item">
					<img src={item.thumbnail} alt={item.title} />
					<h3 className="name">{item.title}</h3>
					<h5 className="uploader">{item.uploader}</h5>
					<h6 className="date">
						You watched this {moment(item.date).fromNow()}
					</h6>
				</div>
			</a>
		</Link>
	);
};

export default HistoryResult;
