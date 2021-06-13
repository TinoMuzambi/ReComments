import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { CommentsProps, CommentModel } from "../../interfaces";

const Comments: React.FC<CommentsProps> = ({ comments }) => {
	return (
		<section className="comments">
			<div className="totals">
				<h5 className="total">
					{comments?.length || 0}
					{comments?.length === 1 ? " Comment" : " Comments"}
				</h5>
			</div>
			<CommentForm isFirstLevelComment={false} isSecondLevelComment={false} />
			{comments?.map((comment: CommentModel) => (
				<div key={comment._id}>
					<Comment comment={comment} />
				</div>
			))}
		</section>
	);
};

export default Comments;
