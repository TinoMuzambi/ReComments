import comments from "../data/comments.json";
import Comment from "./Comment";

const Comments = () => {
	return (
		<section className="comments">
			{comments.map((comment) => (
				<Comment />
			))}
		</section>
	);
};

export default Comments;
