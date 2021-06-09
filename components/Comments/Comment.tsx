import { useState } from "react";

import CommentContent from "./CommentContent";

const Comment: React.FC<any> = ({ comment }) => {
	const [opened, setOpened] = useState(false);
	return (
		<article className="comment">
			<CommentContent comment={comment} />
			{comment.replies && (
				<div className="expand">
					<button className="view-more" onClick={() => setOpened(!opened)}>
						{opened ? <span>🔺 Hide </span> : <span>🔻 View </span>}
						{comment.replies.length} replies
					</button>
					{opened &&
						comment.replies.map((reply: any) => (
							<CommentContent comment={reply} key={reply.id} />
						))}
				</div>
			)}
		</article>
	);
};

export default Comment;
