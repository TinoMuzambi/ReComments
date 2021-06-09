import { CommentInterface } from "../interfaces";

const Comment: React.FC<CommentInterface | any> = ({ comment }) => {
	return (
		<article className="comment">
			<img src="" alt="" className="profile" />
			<div className="details"></div>
		</article>
	);
};

export default Comment;
