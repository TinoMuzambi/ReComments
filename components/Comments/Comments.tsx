import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { CommentsProps, CommentModel } from "../../interfaces";

const Comments: React.FC<CommentsProps> = ({ comments }): JSX.Element => {
	return (
		<section className="comments">
			<div className="totals">
				<h5 className="total">
					{comments?.length || 0}
					{comments?.length === 1 ? " Comment" : " Comments"}
				</h5>
			</div>
			<CommentForm isSecondLevelComment={false} />
			{comments?.map((comment: CommentModel) => (
				<Comment comment={comment} key={comment._id} />
			))}
		</section>
	);
};

export default Comments;
