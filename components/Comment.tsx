import { useState } from "react";

import { CommentInterface } from "../interfaces";
import CommentContent from "./CommentContent";

const Comment: React.FC<CommentInterface | any> = ({ comment }) => {
	const [opened, setOpened] = useState(false);
	return (
		<article className="comment">
			<CommentContent comment={comment} />
			{comment.replies && (
				<div className="expand">
					<button className="view-more">
						View {comment.replies.length} replies
					</button>
					{opened &&
						comment.replies.map((reply) => (
							<CommentContent comment={reply} key={reply.id} />
						))}
				</div>
			)}
		</article>
	);
};

export default Comment;
