import { useState } from "react";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

import CommentContent from "./CommentContent";

const Comment: React.FC<any> = ({ comment }) => {
	const [opened, setOpened] = useState(false);

	return (
		<article className="comment">
			<CommentContent
				comment={comment}
				replyingProp={true}
				replyReply={false}
				id={comment._id}
				setOpened={setOpened}
			/>
			{comment.replies.length > 0 && (
				<div className="expand">
					<button className="view-more" onClick={() => setOpened(!opened)}>
						{opened ? (
							<span>
								<MdArrowDropUp className="icon" />
								<p>
									Hide {comment.replies.length}
									{comment.replies.length === 1 ? " reply" : " replies"}
								</p>
							</span>
						) : (
							<span>
								<MdArrowDropDown className="icon" />
								<p>
									View {comment.replies.length}
									{comment.replies.length === 1 ? " reply" : " replies"}
								</p>
							</span>
						)}
					</button>
					{opened &&
						comment.replies.map((reply: any) => (
							<div key={reply._id}>
								<CommentContent
									comment={reply}
									replyingProp={false}
									replyReply={true}
									id={comment._id}
									setOpened={setOpened}
								/>
							</div>
						))}
				</div>
			)}
		</article>
	);
};

export default Comment;
