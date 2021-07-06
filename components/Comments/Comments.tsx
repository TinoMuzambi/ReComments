import { useState } from "react";

import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { CommentsProps, CommentModel } from "../../interfaces";

const Comments: React.FC<CommentsProps> = ({ comments }): JSX.Element => {
	const [isViewMoreExpanded, setIsViewMoreExpanded] = useState(false);

	return (
		<section className="comments">
			<div className="totals">
				<h5 className="total">
					{comments?.length || 0}
					{comments?.length === 1 ? " Comment" : " Comments"}
				</h5>
			</div>
			<CommentForm isSecondLevelComment={false} />
			{comments?.map((comment: CommentModel) => (
				<div key={comment.id + new Date().toLocaleString()}>
					<Comment
						comment={comment}
						isViewMoreExpanded={isViewMoreExpanded}
						setIsViewMoreExpanded={setIsViewMoreExpanded}
					/>
				</div>
			))}
		</section>
	);
};

export default Comments;
