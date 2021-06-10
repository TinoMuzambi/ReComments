import Comment from "./Comment";
import CommentForm from "./CommentForm";
// import { CommentInterface } from "../interfaces";

const Comments: React.FC<any> = ({ comments }) => {
	return (
		<section className="comments">
			<div className="totals">
				<h5 className="total">{comments?.length || 0} Comments</h5>
				<button className="sort">Sort by</button>
			</div>
			<CommentForm sm={false} />
			{comments?.map((comment: any) => (
				<div key={comment._id}>
					<Comment comment={comment} />
				</div>
			))}
		</section>
	);
};

export default Comments;
