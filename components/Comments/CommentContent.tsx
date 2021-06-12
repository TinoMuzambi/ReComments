import { MouseEventHandler, useContext, useEffect, useState } from "react";
import moment from "moment";
import { MdThumbUp, MdThumbDown, MdEdit, MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";

import { AppContext } from "../../context/AppContext";
import CommentForm from "./CommentForm";
import { CommentContentProps, UserModel, CommentModel } from "../../interfaces";
import { postUpdatedResourceToDb } from "../../utils";

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
			try {
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
			} catch (error) {
				console.error(error);
			}
		}
		setOptionsVisible(false);
	};

	const voteHandler: Function = async (upvoting: boolean) => {
		if (dbUser) {
			getDbUser();
			let userBody: UserModel = dbUser;

			if (userBody && userBody.upvotedIds && userBody.downvotedIds) {
				const shouldUpvoteOrDownvote = upvoting
					? !userBody.upvotedIds.includes(currComment._id)
					: !userBody.downvotedIds.includes(currComment._id);
				if (shouldUpvoteOrDownvote) {
					try {
						// Post incremented upvotes to db.
						let commentBody: CommentModel = { ...currComment };

						commentBody = upvoting
							? { ...commentBody, upvotes: commentBody.upvotes + 1 }
							: { ...commentBody, downvotes: commentBody.downvotes + 1 };

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
								await postUpdatedResourceToDb(commentBody, originalComment);
							}
						} else {
							await postUpdatedResourceToDb(commentBody, currComment);
						}
					} catch (error) {
						console.error(error);
					}

					try {
						// Add comment id to user's upvoted ids.
						userBody = upvoting
							? {
									...userBody,
									upvotedIds: [...userBody.upvotedIds, currComment._id],
							  }
							: {
									...userBody,
									downvotedIds: [...userBody.downvotedIds, currComment._id],
							  };
						await postUpdatedResourceToDb(userBody);
						getDbUser();
					} catch (error) {
						console.error(error);
					}
				} else {
					alert(upvoting ? "Already liked!" : "Already disliked!");
				}
			}

			setCommentFormToReplyVisible(false);
			setCommentFormToEditVisible(false);

			await scrollToSamePosition();
		}
	};
	const upvoteHandler: MouseEventHandler<HTMLButtonElement> = async () => {
		voteHandler(true);
	};

	const downVoteHandler: MouseEventHandler<HTMLButtonElement> = async () => {
		voteHandler(false);
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
					<button className="downvote" onClick={downVoteHandler}>
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
