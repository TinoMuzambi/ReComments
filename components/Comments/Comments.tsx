import comments from "../../data/comments.json";
import Comment from "./Comment";
// import { CommentInterface } from "../interfaces";

const Comments = () => {
	return (
		<section className="comments">
			{comments.map((comment: any) => (
				<Comment comment={comment} key={comment.id} />
			))}
		</section>
	);
};

export default Comments;
