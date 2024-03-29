import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

import CommentContent from "./CommentContent";
import { CommentProps, CommentModel } from "../../interfaces";

const Comment: React.FC<CommentProps> = ({
	comment,
	isViewMoreExpanded,
	setIsViewMoreExpanded,
}): JSX.Element => {
	return (
		<article className="comment">
			<CommentContent
				currComment={comment}
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
									Hide{" "}
									{comment.replies.length === 1
										? " reply"
										: comment.replies.length + " replies"}
								</p>
							</span>
						) : (
							<span>
								<MdArrowDropDown className="icon" />
								<p>
									View{" "}
									{comment.replies.length === 1
										? " reply"
										: comment.replies.length + " replies"}
								</p>
							</span>
						)}
					</button>
					{comment.replies.map((reply: CommentModel, i) => (
						<div
							className={`wrapper ${isViewMoreExpanded && "visible"}`}
							key={reply.id + i.toString()}
						>
							<CommentContent
								currComment={reply}
								originalComment={comment}
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
