import { CommentInterface } from "../interfaces";
import CommentContent from "./CommentContent";

const Comment: React.FC<CommentInterface | any> = ({ comment }) => {
	return (
		<article className="comment">
			<CommentContent comment={comment} />
			<div className="expand"></div>
		</article>
	);
};

export default Comment;
