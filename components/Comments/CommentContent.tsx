import { MouseEventHandler, useContext, useEffect, useState } from "react";
import moment from "moment";
import { MdThumbUp, MdThumbDown, MdEdit, MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";

import { AppContext } from "../../context/AppContext";
import CommentForm from "./CommentForm";
// import { CommentModel } from "../../interfaces";

const CommentContent: React.FC<any> = ({
	currComment,
	isFirstLevelComment,
	isSecondLevelComment,
	setIsViewMoreExpanded,
}) => {
	// Is the comment for visible with the intent to reply to the comment?
	const [commentFormToReplyVisible, setCommentFormToReplyVisible] =
		useState(false);
	// Is the comment for visible with the intent to edit to the comment?
	const [commentFormToEditVisible, setCommentFormToEditVisible] =
		useState(false);
	// Is the orange options box with the edit and delete buttons visible?
	const [optionsVisible, setOptionsVisible] = useState(false);
	const router = useRouter();
	const { dbUser, user, setDbUser } = useContext(AppContext);

	useEffect(() => {
		getDbUser();
	}, []);

	const getDbUser: Function = async () => {
		if (user && user?.emailAddresses && user.names && user.photos) {
			const res = await fetch(
				`/api/users/${user?.emailAddresses[0].metadata?.source?.id}`
			);
			const data = await res.json();
			if (setDbUser) setDbUser(data.data);
		}
	};

	const deleteHandler: MouseEventHandler<HTMLButtonElement> = async () => {
		if (confirm("Are you sure you want to delete this comment?")) {
			await fetch(`/api/comments/${currComment._id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const height = window.scrollY;
			await router.replace(router.asPath);
			setIsViewMoreExpanded(false);
			window.scrollTo(0, height);
		}
		setOptionsVisible(false);
	};

	const upvoteHandler: MouseEventHandler<HTMLButtonElement> = async () => {
		if (dbUser) {
			let body: any = dbUser;

			if (!body.upvotedIds.includes(currComment._id)) {
				body = { ...body, upvotedIds: [...body.upvotedIds, currComment._id] };

				try {
					console.log(body._id);
					await fetch(`/api/users/${body._id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(body),
					});
				} catch (error) {
					return console.error(error);
				}
				try {
					body = currComment;

					body = { ...body, upvotes: body.upvotes + 1 };

					await fetch(`/api/comments/${currComment._id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(body),
					});
					getDbUser();
				} catch (error) {
					console.error(error);
				}
			} else {
				console.log("Already liked!");
			}

			setCommentFormToReplyVisible(false);
			setCommentFormToEditVisible(false);

			const height = window.scrollY;
			await router.replace(router.asPath);
			setIsViewMoreExpanded(false);
			window.scrollTo(0, height);
		}
	};

	return (
		<div className="content">
			<img src={currComment.image} alt={currComment.name} className="profile" />
			<div className="details">
				<div className="top">
					<h5 className="name">{currComment.name}</h5>
					<p className="datetime">
						{moment(currComment.createdAt).fromNow()}{" "}
						{currComment?.edited && "(edited)"}
					</p>
				</div>
				<p className="text">
					{currComment?.mention && (
						<span className="mention">{currComment.mention} </span>
					)}
					{currComment.comment}
				</p>
				<div className="actions">
					<div className="upvotes">
						<button className="upvote" onClick={upvoteHandler}>
							<span>
								<MdThumbUp className="icon" />
							</span>
						</button>
						<p className="upvote-count">{currComment.upvotes}</p>
					</div>
					<button className="downvote">
						<span>
							<MdThumbDown className="icon" />
						</span>
					</button>
					<button
						className="reply"
						onClick={() => {
							setCommentFormToReplyVisible(true);
							setCommentFormToEditVisible(false);
						}}
					>
						REPLY
					</button>
				</div>
				{(commentFormToReplyVisible || commentFormToEditVisible) && (
					<CommentForm
						isFirstLevelComment={isFirstLevelComment}
						commentFormToEditVisible={commentFormToEditVisible}
						setCommentFormToEditVisible={setCommentFormToEditVisible}
						isSecondLevelComment={isSecondLevelComment}
						setCommentFormToReplyVisible={setCommentFormToReplyVisible}
						setIsViewMoreExpanded={setIsViewMoreExpanded}
						currComment={currComment}
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
							setCommentFormToEditVisible(true);
							setCommentFormToReplyVisible(false);
							setOptionsVisible(false);
						}}
					>
						<MdEdit className="icon" /> <p className="label">Edit</p>
					</button>
					<button className="item" onClick={deleteHandler}>
						<MdDelete className="icon" /> <p className="label">Delete</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommentContent;
