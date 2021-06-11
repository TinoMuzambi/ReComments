import { useState } from "react";
import moment from "moment";
import { MdThumbUp, MdThumbDown, MdEdit, MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

import CommentForm from "./CommentForm";

const CommentContent: React.FC<any> = ({
	comment,
	replyingProp,
	replyReply,
	id,
	setOpened,
}) => {
	const [replying, setReplying] = useState(false);
	const [editing, setEditing] = useState(false);
	const [optionsVisible, setOptionsVisible] = useState(false);

	return (
		<div className="content">
			<img src={comment.image} alt={comment.name} className="profile" />
			<div className="details">
				<div className="top">
					<h5 className="name">{comment.name}</h5>
					<p className="datetime">{moment(comment.createdAt).fromNow()}</p>
				</div>
				<p className="text">
					{comment?.mention && (
						<span className="mention">{comment.mention} </span>
					)}
					{comment.comment}
				</p>
				<div className="actions">
					<div className="upvotes">
						<button className="upvote">
							<span>
								<MdThumbUp className="icon" />
							</span>
						</button>
						<p className="upvote-count">{comment.upvotes}</p>
					</div>
					<button className="downvote">
						<span>
							<MdThumbDown className="icon" />
						</span>
					</button>
					<button
						className="reply"
						onClick={() => {
							setReplying(true);
							setEditing(false);
						}}
					>
						REPLY
					</button>
				</div>
				{(replying || editing) && (
					<CommentForm
						replying={replyingProp}
						editing={editing}
						setEditing={setEditing}
						replyReplying={replyReply}
						setReplying={setReplying}
						id={id}
						setOpenedProp={setOpened}
					/>
				)}
			</div>
			<div className="options">
				<button
					className="select"
					onClick={() => setOptionsVisible(!optionsVisible)}
				>
					<BsThreeDotsVertical className="icon" />
				</button>

				<div className={`holder ${optionsVisible && "visible"}`}>
					<button
						className="item"
						onClick={() => {
							setEditing(true);
							setReplying(false);
							setOptionsVisible(false);
						}}
					>
						<MdEdit className="icon" /> <p className="label">Edit</p>
					</button>
					<button className="item">
						<MdDelete className="icon" /> <p className="label">Delete</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommentContent;
