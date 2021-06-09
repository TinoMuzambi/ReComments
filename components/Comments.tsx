import comments from "../data/comments.json";
import Comment from "./Comment";

const Comments = () => {
	return (
		<section className="comments">
			{comments.map((comment) => (
				<Comment comment={comment} key={comment.id} />
			))}
		</section>
	);
};

export default Comments;
