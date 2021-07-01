import { MouseEventHandler, useContext, useEffect, useState } from "react";
import moment from "moment";
import { MdThumbUp, MdThumbDown, MdEdit, MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import Autolinker from "autolinker";

import { AppContext } from "../../context/AppContext";
import { CommentContentProps, UserModel, CommentModel } from "../../interfaces";
import {
	postUpdatedResourceToDb,
	VOTING_TYPES,
	getUpdatedVoteCommentBody,
	getDbUser,
	hideNotice,
} from "../../utils";
import CommentForm from "./CommentForm";
import Spinner from "../Spinner";
import Notice from "../Notice";

const CommentContent: React.FC<CommentContentProps> = ({
	currComment,
	originalComment,
	isSecondLevelComment,
	setIsViewMoreExpanded,
}): JSX.Element => {
	const [commentFormToReplyVisible, setCommentFormToReplyVisible] =
		useState(false);
	const [commentFormToEditVisible, setCommentFormToEditVisible] =
		useState(false);

	const [optionsVisible, setOptionsVisible] = useState(false);
	const [spinnerVisible, setSpinnerVisible] = useState(false);

	const [noticeVisible, setNoticeVisible] = useState<boolean>(false);
	const [noticeNoButtons, setNoticeNoButtons] = useState<1 | 2>(1);
	const [noticeTitle, setNoticeTitle] = useState("");
	const [noticeSubtitle, setNoticeSubtitle] = useState("");
	const [noticeFirstButtonText, setNoticeFirstButtonText] = useState("");
	const [noticeSecondButtonText, setNoticeSecondButtonText] = useState("");

	const router = useRouter();
	const { dbUser, user, setDbUser } = useContext(AppContext);

	useEffect(() => {
		// Handle visibility of notice component.
		if (noticeTitle !== "") setNoticeVisible(true);
		else setNoticeVisible(false);
	}, [noticeTitle]);

	useEffect(() => {
		// Handle making timer disappear after 4 seconds if one button notice.
		let timer: NodeJS.Timeout;
		if (noticeNoButtons === 1) {
			if (noticeVisible) {
				timer = setTimeout(() => {
					setNoticeVisible(false);
					setNoticeTitle("");
				}, 4000);
			}
		}
		return () => {
			clearTimeout(timer);
		};
	}, [noticeVisible]);

	useEffect(() => {
		// Handle making options box disappear on outside click.
		const checkOptionsVisible: EventListener = (e) => {
			if (e && e.target) {
				const target = e.target as HTMLElement;
				if (!target.closest(".options")) {
					setOptionsVisible(false);
				}
			}
		};
		document.addEventListener("click", checkOptionsVisible, false);
		return () => {
			document.removeEventListener("click", checkOptionsVisible, false);
		};
	}, []);

	const hideNoticeWrapper: Function = () => {
		hideNotice(
			setNoticeVisible,
			setNoticeTitle,
			setNoticeSubtitle,
			setNoticeNoButtons,
			setNoticeFirstButtonText,
			setNoticeSecondButtonText
		);
	};

	const scrollToSamePosition: Function = async (): Promise<void> => {
		const height = window.scrollY;
		await router.replace(router.asPath);
		window.scrollTo(0, height);
	};

	const editHandler: MouseEventHandler<HTMLButtonElement> =
		async (): Promise<void> => {
			if (dbUser && dbUser.userId === currComment.authorId) {
				setCommentFormToEditVisible(true);
				setCommentFormToReplyVisible(false);
				setOptionsVisible(false);
			} else {
				setNoticeTitle("Only edit your own comments");
				setNoticeSubtitle("You can only edit comments that you made");
				setNoticeNoButtons(1);
				setNoticeFirstButtonText("Ok");
				setOptionsVisible(false);
			}
		};

	const deleteCallback: Function = async () => {
		setSpinnerVisible(true);
		try {
			if (isSecondLevelComment) {
				// Deleting a reply.
				if (originalComment && originalComment.replies) {
					const deletedComment = {
						...originalComment,
						replies: originalComment.replies.filter(
							(reply) => reply.id !== currComment.id
						),
					};
					postUpdatedResourceToDb(deletedComment, originalComment.id);
				}
			} else {
				// Deleting a top level comment.
				await fetch(`/api/comments/${currComment.id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				});
			}

			await scrollToSamePosition();
		} catch (error) {
			hideNoticeWrapper();
			setNoticeTitle("Comment not deleted");
			setNoticeSubtitle(
				"Something went wrong. Please try again or contact the developer."
			);
			setNoticeNoButtons(1);
			setNoticeFirstButtonText("Ok");
		}
		setSpinnerVisible(false);
	};

	const deleteHandler: MouseEventHandler<HTMLButtonElement> =
		async (): Promise<void> => {
			if (dbUser) {
				if (dbUser.userId === currComment.authorId) {
					setNoticeTitle("Delete comment");
					setNoticeSubtitle("Are you sure you want to delete this comment?");
					setNoticeNoButtons(2);
					setNoticeFirstButtonText("Yes");
					setNoticeSecondButtonText("Cancel");
				} else {
					setNoticeTitle("Only delete your own comments");
					setNoticeSubtitle("You can only delete comments that you made");
					setNoticeNoButtons(1);
					setNoticeFirstButtonText("Ok");
				}
			}
			setOptionsVisible(false);
		};

	const shouldDoVoteUpdate: Function = (
		voteType: string,
		body: UserModel
	): Boolean => {
		const value = false;

		if (body.upvotedIds && body.downvotedIds && currComment.id) {
			if (voteType === VOTING_TYPES.upvoting)
				return !body.upvotedIds.includes(currComment.id);
			else if (voteType === VOTING_TYPES.downvoting)
				return !body.downvotedIds.includes(currComment.id);
			else if (voteType === VOTING_TYPES.undoUpvoting)
				return body.upvotedIds.includes(currComment.id);
			else if (voteType === VOTING_TYPES.undoDownvoting)
				return body.downvotedIds.includes(currComment.id);
		}

		return value;
	};

	const getUpdatedUserVoteIdsBody: Function = (
		voteType: string,
		user: UserModel
	): UserModel => {
		if (user.upvotedIds && user.downvotedIds && currComment.id) {
			if (voteType === VOTING_TYPES.upvoting)
				return {
					...user,
					upvotedIds: [...user.upvotedIds, currComment.id],
				};
			else if (voteType === VOTING_TYPES.downvoting)
				return {
					...user,
					downvotedIds: [...user.downvotedIds, currComment.id],
				};
			else if (voteType === VOTING_TYPES.undoUpvoting)
				return {
					...user,
					upvotedIds: user.upvotedIds.filter((id) => currComment.id !== id),
				};
			else if (voteType === VOTING_TYPES.undoDownvoting)
				return {
					...user,
					downvotedIds: user.downvotedIds.filter((id) => currComment.id !== id),
				};
		}
		return user;
	};

	const voteHandler: Function = async (voteType: string): Promise<void> => {
		if (dbUser) {
			setSpinnerVisible(true);
			getDbUser(user, setDbUser);
			let userBody: UserModel = { ...dbUser };

			if (userBody && userBody.upvotedIds && userBody.downvotedIds) {
				if (shouldDoVoteUpdate(voteType, userBody)) {
					try {
						// Post incremented upvotes to db.
						let commentBody: CommentModel = { ...currComment };

						commentBody = getUpdatedVoteCommentBody(voteType, commentBody);

						if (isSecondLevelComment && originalComment) {
							let updatedComment: CommentModel = {
								...originalComment,
							};

							if (updatedComment.replies) {
								for (let i = 0; i < updatedComment.replies.length; i++) {
									if (updatedComment.replies[i].id === currComment.id) {
										updatedComment.replies[i] = commentBody;
									}
								}
							}

							commentBody = updatedComment;
							await postUpdatedResourceToDb(commentBody, originalComment.id);
						} else {
							await postUpdatedResourceToDb(commentBody, currComment.id);
						}
					} catch (error) {
						setNoticeTitle("Change not made");
						setNoticeSubtitle(
							"Something went wrong. Please try again or contact the developer."
						);
						setNoticeNoButtons(1);
						setNoticeFirstButtonText("Ok");
					}

					try {
						// Add comment id to user's upvoted ids.
						userBody = getUpdatedUserVoteIdsBody(voteType, userBody);
						await postUpdatedResourceToDb(userBody);
						getDbUser(user, setDbUser);
					} catch (error) {
						setNoticeTitle("Change not made");
						setNoticeSubtitle(
							"Something went wrong. Please try again or contact the developer."
						);
						setNoticeNoButtons(1);
						setNoticeFirstButtonText("Ok");
					}
				}
			}

			setCommentFormToReplyVisible(false);
			setCommentFormToEditVisible(false);

			await scrollToSamePosition();
			setSpinnerVisible(false);
		}
	};
	const upvoteHandler: MouseEventHandler<HTMLButtonElement> =
		async (): Promise<void> => {
			if (currComment.id && dbUser?.upvotedIds?.includes(currComment.id))
				voteHandler(VOTING_TYPES.undoUpvoting);
			else voteHandler(VOTING_TYPES.upvoting);
		};

	const downVoteHandler: MouseEventHandler<HTMLButtonElement> =
		async (): Promise<void> => {
			if (currComment.id && dbUser?.downvotedIds?.includes(currComment.id))
				voteHandler(VOTING_TYPES.undoDownvoting);
			else voteHandler(VOTING_TYPES.downvoting);
		};

	const currCommentUpvoted: Function = (): Boolean => {
		let value = false;
		if (dbUser && dbUser.upvotedIds && currComment.id) {
			value = dbUser.upvotedIds.includes(currComment.id);
		}
		return value;
	};

	const currCommentDownvoted: Function = (): Boolean => {
		let value = false;
		if (dbUser && dbUser.downvotedIds && currComment.id) {
			value = dbUser.downvotedIds.includes(currComment.id);
		}
		return value;
	};

	return (
		<div className="content">
			<Notice
				visible={noticeVisible}
				setVisible={setNoticeVisible}
				title={noticeTitle}
				subtitle={noticeSubtitle}
				noButtons={noticeNoButtons}
				firstButtonText={noticeFirstButtonText}
				secondButtonText={noticeSecondButtonText}
				confirmCallback={deleteCallback}
				cancelCallback={hideNoticeWrapper}
			/>
			<div className="body">
				<img
					src={currComment.image}
					alt={currComment.name}
					className={`profile ${isSecondLevelComment && "sm"}`}
				/>
				<div className="details">
					<div className="top">
						<h5 className="name">{currComment.name}</h5>
						<p
							className="datetime"
							title={moment(currComment.createdAt).format(
								"MMMM Do YYYY, h:mm:ss a"
							)}
						>
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
								data-upvoted={currCommentUpvoted() ? "Unlike" : "Like"}
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
							data-downvoted={currCommentDownvoted() ? "Undislike" : "Dislike"}
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
							isSecondLevelComment={isSecondLevelComment}
							commentFormToEditVisible={commentFormToEditVisible}
							commentFormToReplyVisible={commentFormToReplyVisible}
							setCommentFormToEditVisible={setCommentFormToEditVisible}
							setCommentFormToReplyVisible={setCommentFormToReplyVisible}
							setIsViewMoreExpanded={setIsViewMoreExpanded}
							currComment={currComment}
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
			{spinnerVisible && <Spinner />}
		</div>
	);
};

export default CommentContent;
