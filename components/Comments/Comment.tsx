import { useState } from "react";

import { CommentInterface } from "../../interfaces";
import CommentContent from "./CommentContent";

const Comment: React.FC<CommentInterface | any> = ({ comment }) => {
	const [opened, setOpened] = useState(false);
	return (
		<article className="comment">
			<CommentContent comment={comment} reply={false} />
			{comment.replies && (
				<div className="expand">
					<button className="view-more" onClick={() => setOpened(!opened)}>
						{opened ? <span>🔺 Hide </span> : <span>🔻 View </span>}
						{comment.replies.length} replies
					</button>
					{opened &&
						comment.replies.map((reply: CommentInterface) => (
							<CommentContent comment={reply} key={reply.id} reply={true} />
						))}
				</div>
			)}
		</article>
	);
};

export default Comment;
