import Link from "next/link";
import moment from "moment";
import { MdClose } from "react-icons/md";

import { HistoryItem } from "../interfaces";

const HistoryResult: React.FC<{ item: HistoryItem }> = ({ item }) => {
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
				<button>
					<MdClose className="icon" />
				</button>
			</div>
			<Link href={`/video/${item.id}`}>
				<a>
					<h5 className="uploader">{item.uploader}</h5>
					<h6 className="date">
						You watched this {moment(item.date).fromNow()}
					</h6>
				</a>
			</Link>
		</div>
	);
};

export default HistoryResult;
