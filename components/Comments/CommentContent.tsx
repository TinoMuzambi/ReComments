import { CommentInterface } from "../../interfaces";

const CommentContent: React.FC<CommentInterface | any> = ({ comment }) => {
	return (
		<div className="content">
			<img src={comment.image} alt={comment.name} className="profile" />
			<div className="details">
				<div className="top">
					<h5 className="name">{comment.name}</h5>
					<p className="datetime">{comment.datetime}</p>
				</div>
				<p className="text">{comment.comment}</p>
				<div className="actions">
					<div className="upvotes">
						<button className="upvote">
							<span>👍🏾</span>
						</button>
						<p className="upvote-count">{comment.upvotes}</p>
					</div>
					<button className="downvote">
						<span>👎🏾</span>
					</button>
					<button className="reply">REPLY</button>
				</div>
			</div>
		</div>
	);
};

export default CommentContent;
