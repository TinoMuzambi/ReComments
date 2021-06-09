import comments from "../../data/comments.json";
import Comment from "./Comment";
// import { CommentInterface } from "../interfaces";

const Comments = () => {
	return (
		<section className="comments">
			<div className="totals">
				<h5 className="total">{comments[0]} Comments</h5>
				<button className="sort">Sort by</button>
			</div>
			{comments.slice(1).map((comment: any) => (
				<Comment comment={comment} key={comment.id} />
			))}
		</section>
	);
};

export default Comments;
