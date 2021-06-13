import { MouseEventHandler, useContext, useEffect, useState } from "react";
import moment from "moment";
import { MdThumbUp, MdThumbDown, MdEdit, MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import Autolinker from "autolinker";

import { AppContext } from "../../context/AppContext";
import CommentForm from "./CommentForm";
import { CommentContentProps, UserModel, CommentModel } from "../../interfaces";
import { postUpdatedResourceToDb, VOTING_TYPES } from "../../utils";

const CommentContent: React.FC<CommentContentProps> = ({
	currComment,
	originalComment,
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

	const scrollToSamePosition: Function = async (): Promise<void> => {
		const height = window.scrollY;
		await router.replace(router.asPath);
		window.scrollTo(0, height);
	};

	const getDbUser: Function = async (): Promise<void> => {
		if (user && user.emailAddresses) {
			const res = await fetch(
				`/api/users/${user?.emailAddresses[0].metadata?.source?.id}`
			);
			const data = await res.json();

			if (setDbUser) setDbUser(data.data);
		}
	};

	const editHandler: MouseEventHandler<HTMLButtonElement> =
		async (): Promise<void> => {
			if (dbUser) {
				if (dbUser.userId === currComment.authorId) {
					setCommentFormToEditVisible(true);
					setCommentFormToReplyVisible(false);
					setOptionsVisible(false);
				} else {
					alert("This ain't your comment to edit!");
				}
			}
		};
	const deleteHandler: MouseEventHandler<HTMLButtonElement> =
		async (): Promise<void> => {
			if (dbUser) {
				if (dbUser.userId === currComment.authorId) {
					if (confirm("Are you sure you want to delete this comment?")) {
						try {
							if (isSecondLevelComment) {
								if (originalComment && originalComment.replies) {
									const deletedComment = {
										...originalComment,
										replies: originalComment.replies.filter(
											(reply) => reply._id !== currComment._id
										),
									};
									postUpdatedResourceToDb(deletedComment, originalComment._id);
								}
							} else {
								await fetch(`/api/comments/${currComment._id}`, {
									method: "DELETE",
									headers: {
										"Content-Type": "application/json",
									},
								});
							}

							await scrollToSamePosition();
						} catch (error) {
							console.error(error);
						}
					}
				} else {
					alert("This ain't your comment to delete!");
				}
			}
			setOptionsVisible(false);
		};

	const shouldDoVoteUpdate: Function = (
		voteType: string,
		body: UserModel
	): Boolean => {
		const value = false;

		if (body.upvotedIds && body.downvotedIds) {
			if (voteType === VOTING_TYPES.upvoting)
				return !body.upvotedIds.includes(currComment._id);
			else if (voteType === VOTING_TYPES.downvoting)
				return !body.downvotedIds.includes(currComment._id);
			else if (voteType === VOTING_TYPES.undoUpvoting)
				return body.upvotedIds.includes(currComment._id);
			else if (voteType === VOTING_TYPES.undoDownvoting)
				return body.downvotedIds.includes(currComment._id);
		}

		return value;
	};

	const getUpdatedVoteCommentBody: Function = (
		voteType: string,
		comment: CommentModel
	): CommentModel => {
		if (voteType === VOTING_TYPES.upvoting)
			return { ...comment, upvotes: comment.upvotes + 1 };
		else if (voteType === VOTING_TYPES.downvoting)
			return { ...comment, downvotes: comment.downvotes + 1 };
		else if (voteType === VOTING_TYPES.undoUpvoting)
			return { ...comment, upvotes: comment.upvotes - 1 };
		else if (voteType === VOTING_TYPES.undoDownvoting)
			return { ...comment, downvotes: comment.downvotes - 1 };
		return comment;
	};

	const getUpdatedUserVoteIdsBody: Function = (
		voteType: string,
		user: UserModel
	): UserModel => {
		if (user.upvotedIds && user.downvotedIds) {
			if (voteType === VOTING_TYPES.upvoting)
				return {
					...user,
					upvotedIds: [...user.upvotedIds, currComment._id],
				};
			else if (voteType === VOTING_TYPES.downvoting)
				return {
					...user,
					downvotedIds: [...user.downvotedIds, currComment._id],
				};
			else if (voteType === VOTING_TYPES.undoUpvoting)
				return {
					...user,
					upvotedIds: user.upvotedIds.filter((id) => currComment._id !== id),
				};
			else if (voteType === VOTING_TYPES.undoDownvoting)
				return {
					...user,
					downvotedIds: user.downvotedIds.filter(
						(id) => currComment._id !== id
					),
				};
		}
		return user;
	};

	const voteHandler: Function = async (voteType: string): Promise<void> => {
		if (dbUser) {
			getDbUser();
			let userBody: UserModel = dbUser;

			if (userBody && userBody.upvotedIds && userBody.downvotedIds) {
				if (shouldDoVoteUpdate(voteType, userBody)) {
					try {
						// Post incremented upvotes to db.
						let commentBody: CommentModel = { ...currComment };

						commentBody = getUpdatedVoteCommentBody(voteType, commentBody);

						if (isSecondLevelComment) {
							if (originalComment) {
								const updatedComment = {
									...originalComment,
								};

								if (updatedComment.replies) {
									for (let i = 0; i < updatedComment.replies.length; i++) {
										if (updatedComment.replies[i]._id === currComment._id) {
											updatedComment.replies[i] = commentBody;
										}
									}
								}

								commentBody = updatedComment;
							}
						}

						if (isSecondLevelComment) {
							if (originalComment) {
								await postUpdatedResourceToDb(commentBody, originalComment._id);
							}
						} else {
							await postUpdatedResourceToDb(commentBody, currComment._id);
						}
					} catch (error) {
						console.error(error);
					}

					try {
						// Add comment id to user's upvoted ids.
						userBody = getUpdatedUserVoteIdsBody(voteType, userBody);
						await postUpdatedResourceToDb(userBody);
						getDbUser();
					} catch (error) {
						console.error(error);
					}
				} else {
					// alert(upvoting ? "Already liked!" : "Already disliked!");
				}
			}

			setCommentFormToReplyVisible(false);
			setCommentFormToEditVisible(false);

			await scrollToSamePosition();
		}
	};
	const upvoteHandler: MouseEventHandler<HTMLButtonElement> =
		async (): Promise<void> => {
			if (dbUser?.upvotedIds?.includes(currComment._id))
				voteHandler(VOTING_TYPES.undoUpvoting);
			else voteHandler(VOTING_TYPES.upvoting);
		};

	const downVoteHandler: MouseEventHandler<HTMLButtonElement> =
		async (): Promise<void> => {
			if (dbUser?.downvotedIds?.includes(currComment._id))
				voteHandler(VOTING_TYPES.undoDownvoting);
			else voteHandler(VOTING_TYPES.downvoting);
		};

	const currCommentUpvoted: Function = (): Boolean => {
		let value = false;
		if (dbUser && dbUser.upvotedIds) {
			value = dbUser.upvotedIds.includes(currComment._id);
		}
		return value;
	};

	const currCommentDownvoted: Function = (): Boolean => {
		let value = false;
		if (dbUser && dbUser.downvotedIds) {
			value = dbUser.downvotedIds.includes(currComment._id);
		}
		return value;
	};

	return (
		<div className="content">
			<div className="body">
				<img
					src={currComment.image}
					alt={currComment.name}
					className={`profile ${isSecondLevelComment && "sm"}`}
				/>
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

						{parse(
							Autolinker.link(currComment.comment, {
								className: "embed-link",
							})
						)}
					</p>
					<div className="actions">
						<div className="upvotes">
							<button
								className={`upvote ${currCommentUpvoted() && "active"}`}
								onClick={upvoteHandler}
							>
								<span>
									<MdThumbUp className="icon" />
								</span>
							</button>
							<p className="upvote-count">{currComment.upvotes}</p>
						</div>
						<button
							className={`downvote ${currCommentDownvoted() && "active"}`}
							onClick={downVoteHandler}
						>
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
					{(commentFormToEditVisible || commentFormToReplyVisible) && (
						<CommentForm
							isFirstLevelComment={isFirstLevelComment}
							isSecondLevelComment={isSecondLevelComment}
							commentFormToEditVisible={commentFormToEditVisible}
							commentFormToReplyVisible={commentFormToReplyVisible}
							setCommentFormToEditVisible={setCommentFormToEditVisible}
							setCommentFormToReplyVisible={setCommentFormToReplyVisible}
							setIsViewMoreExpanded={setIsViewMoreExpanded}
							currComment={
								isFirstLevelComment || isSecondLevelComment
									? commentFormToEditVisible
										? currComment
										: originalComment
									: currComment
							}
							originalComment={originalComment}
						/>
					)}
				</div>
			</div>
			<div className="options">
				<button
					className="select"
					onClick={() => setOptionsVisible(!optionsVisible)}
				>
					<BsThreeDotsVertical className="icon" />
				</button>

				<div className={`holder ${optionsVisible && "visible"}`}>
					<button className="item" onClick={editHandler}>
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
