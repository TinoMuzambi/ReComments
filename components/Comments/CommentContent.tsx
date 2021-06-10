import moment from "moment";
import CommentForm from "./CommentForm";

const CommentContent: React.FC<any> = ({ comment }) => {
	return (
		<div className="content">
			<img src={comment.image} alt={comment.name} className="profile" />
			<div className="details">
				<div className="top">
					<h5 className="name">{comment.name}</h5>
					<p className="datetime">{moment(comment.updatedAt).fromNow()}</p>
				</div>
				<p className="text">
					{comment?.mention && (
						<span className="mention">{comment.mention} </span>
					)}
					{comment.comment}
				</p>
				<div className="actions">
					<div className="upvotes">
						<button className="upvote">
							<span role="img" aria-label="thumbs up">
								👍🏾
							</span>
						</button>
						<p className="upvote-count">{comment.upvotes}</p>
					</div>
					<button className="downvote">
						<span role="img" aria-label="thumbs down">
							👎🏾
						</span>
					</button>
					<button className="reply">REPLY</button>
				</div>
				<CommentForm sm={true} />
			</div>
		</div>
	);
};

export default CommentContent;
