import { useState } from "react";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

import CommentContent from "./CommentContent";
import { CommentProps } from "../../interfaces";

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
			{comment.replies.length > 0 && (
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
						comment.replies.map((reply: any) => (
							<div key={reply._id}>
								<CommentContent
									currComment={reply}
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
