import { useState } from "react";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

import CommentContent from "./CommentContent";
import { CommentProps, CommentModel } from "../../interfaces";

const Comment: React.FC<CommentProps> = ({ comment }) => {
	const [isViewMoreExpanded, setIsViewMoreExpanded] = useState(false);

	return (
		<article className="comment">
			<CommentContent
				currComment={comment}
				isFirstLevelComment={false}
				isSecondLevelComment={false}
				setIsViewMoreExpanded={setIsViewMoreExpanded}
			/>
			{comment.replies && comment.replies.length > 0 && (
				<div className="expand">
					<button
						className="view-more"
						onClick={() => setIsViewMoreExpanded(!isViewMoreExpanded)}
					>
						{isViewMoreExpanded ? (
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
					{isViewMoreExpanded &&
						comment.replies.map((reply: CommentModel) => (
							<div key={reply._id}>
								<CommentContent
									currComment={reply}
									originalComment={comment}
									isFirstLevelComment={false}
									isSecondLevelComment={true}
									setIsViewMoreExpanded={setIsViewMoreExpanded}
								/>
							</div>
						))}
				</div>
			)}
		</article>
	);
};

export default Comment;
