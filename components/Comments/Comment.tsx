import { useState } from "react";

import CommentContent from "./CommentContent";

const Comment: React.FC<any> = ({ comment }) => {
	const [opened, setOpened] = useState(false);

	return (
		<article className="comment">
			<CommentContent
				comment={comment}
				replyingProp={true}
				replyReply={false}
			/>
			{comment.replies.length > 0 && (
				<div className="expand">
					<button className="view-more" onClick={() => setOpened(!opened)}>
						{opened ? (
							<span role="img" aria-label="up">
								🔺 Hide{" "}
							</span>
						) : (
							<span role="img" aria-label="down">
								🔻 View{" "}
							</span>
						)}
						{comment.replies.length} replies
					</button>
					{opened &&
						comment.replies.map((reply: any) => (
							<div key={reply._id}>
								<CommentContent
									comment={reply}
									replyingProp={false}
									replyReply={true}
								/>
							</div>
						))}
				</div>
			)}
		</article>
	);
};

export default Comment;
