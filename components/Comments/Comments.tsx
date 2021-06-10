import Comment from "./Comment";
import CommentForm from "./CommentForm";
// import { CommentInterface } from "../interfaces";

const Comments: React.FC<any> = ({ comments }) => {
	return (
		<section className="comments">
			<div className="totals">
				<h5 className="total">{comments.length} Comments</h5>
				<button className="sort">Sort by</button>
			</div>
			<CommentForm />
			{comments.map((comment: any) => (
				<Comment comment={comment} key={comment.id} />
			))}
		</section>
	);
};

export default Comments;
