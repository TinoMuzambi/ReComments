import {
	useState,
	useContext,
	MouseEventHandler,
	FormEventHandler,
	useEffect,
} from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

import { AppContext } from "../../context/AppContext";
import { CommentFormProps, CommentModel } from "../../interfaces";
import { postUpdatedResourceToDb } from "../../utils";

const CommentForm: React.FC<CommentFormProps> = ({
	isFirstLevelComment,
	commentFormToEditVisible,
	commentFormToReplyVisible,
	setCommentFormToEditVisible,
	isSecondLevelComment,
	setCommentFormToReplyVisible,
	setIsViewMoreExpanded,
	currComment,
	originalComment,
}) => {
	const [cancelCommentButtonsVisible, setCancelCommentButtonsVisible] =
		useState(commentFormToEditVisible || commentFormToReplyVisible);
	const [commentInput, setCommentInput] = useState("");
	const { user } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (isSecondLevelComment) {
			if (user && user.names) {
				setCommentInput(`@${user.names[0].givenName as string} `);
			}
		}
	}, [isSecondLevelComment]);

	useEffect(() => {
		if (commentFormToEditVisible) {
			if (currComment) setCommentInput(currComment.comment);
		}
	}, [commentFormToEditVisible]);

	const getComment: Function = async (comment: CommentModel): Promise<any> => {
		let commentToUpdate: any;
		if (comment) {
			const response = await fetch(`/api/comments/${comment._id}`);
			// Get comment to update.
			commentToUpdate = await response.json();
			commentToUpdate = commentToUpdate.data[0];
		}
		return commentToUpdate;
	};

	const scrollToSamePosition: Function = async (): Promise<void> => {
		const height = window.scrollY;
		await router.replace(router.asPath);
		setCommentInput("");
		setCancelCommentButtonsVisible(false);
		window.scrollTo(0, height);
	};

	const postNewCommentToDb = async (body: CommentModel): Promise<void> => {
		await fetch("/api/comments", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
	};

	const cancelHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		setCancelCommentButtonsVisible(false);
		if (setCommentFormToReplyVisible) setCommentFormToReplyVisible(false);
		if (setCommentFormToReplyVisible) setCommentFormToReplyVisible(false);
		if (setCommentFormToEditVisible) setCommentFormToEditVisible(false);
	};

	const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const submitComment: Function = async () => {
			if (user && user.emailAddresses && user.names && user.photos) {
				let body: CommentModel = {
					_id: uuidv4(),
					videoId: router.query.url as string,
					authorId: user?.emailAddresses[0].metadata?.source?.id as string,
					email: user?.emailAddresses[0].value as string,
					name: user.names[0].givenName as string,
					comment: commentInput,
					image: user.photos[0].url as string,
					upvotes: 0,
					downvotes: 0,
					createdAt: new Date(),
					updatedAt: new Date(),
					mention: null,
					edited: false,
				};

				try {
					if (commentFormToEditVisible) {
						// Edit comment.
						if (currComment) {
							if (isSecondLevelComment || isFirstLevelComment) {
								if (originalComment)
									body = {
										...originalComment,
									};
								// Editing replies.
								if (body && body.replies && originalComment) {
									for (let i = 0; i < body.replies.length; i++) {
										if (
											body.replies[i]._id === currComment._id &&
											originalComment.replies
										) {
											let newReplies = originalComment.replies;
											newReplies[i] = {
												...newReplies[i],
												comment: commentInput,
												edited: true,
												updatedAt: new Date(),
											};
											body = { ...originalComment, replies: newReplies };
											break;
										}
									}
								}

								// Post update to DB.
								if (originalComment)
									await postUpdatedResourceToDb(
										body,
										"comment",
										originalComment
									);
							} else {
								// Editing top level comment.
								body = {
									...currComment,
									edited: true,
									comment: commentInput,
									updatedAt: new Date(),
								};
							}

							// Post update to DB.

							await postUpdatedResourceToDb(body, "comment", currComment);

							// Hide forms and expand view more.
							if (setIsViewMoreExpanded) setIsViewMoreExpanded(true);
							if (setCommentFormToReplyVisible)
								setCommentFormToReplyVisible(false);
							if (setCommentFormToEditVisible)
								setCommentFormToEditVisible(false);
						}
					} else if (
						isFirstLevelComment ||
						isSecondLevelComment ||
						commentFormToReplyVisible
					) {
						if (currComment) {
							// Reply to comment.
							const commentToUpdate = await getComment(currComment);

							if (isSecondLevelComment) {
								// Add mention if second level comment.
								body = {
									...commentToUpdate,
									replies: [
										...commentToUpdate?.replies,
										{
											...body,
											comment: commentInput.replace(
												(("@" + user.names[0].givenName) as string) + " ",
												""
											),
											mention: `@${user.names[0].givenName as string}`,
										},
									],
								};
							} else {
								body = {
									...commentToUpdate,
									replies: [...commentToUpdate?.replies, body],
								};
							}

							// Post updated comment to DB.
							await postUpdatedResourceToDb(body, "comment", currComment);

							// Hide forms and expand view more.
							if (setIsViewMoreExpanded) setIsViewMoreExpanded(true);
							if (setCommentFormToReplyVisible)
								setCommentFormToReplyVisible(false);
						}
					} else {
						// Post new comment to DB.
						await postNewCommentToDb(body);
					}

					// Refresh then scroll to same place on the page.
					await scrollToSamePosition();
				} catch (error) {
					console.error(error);
				}
			}
		};
		submitComment();
	};

	return (
		<article className={`comment-form-holder ${isFirstLevelComment && "sm"}`}>
			{user && user.photos && user.names && (
				<img
					src={user?.photos[0].url}
					alt={user?.names[0].givenName}
					className={`profile ${isFirstLevelComment && "sm"}`}
				/>
			)}
			<form className="comment-form" onSubmit={submitHandler}>
				<textarea
					className={`text ${isFirstLevelComment && "sm"}`}
					onFocus={() => {
						if (!isFirstLevelComment && !isSecondLevelComment)
							setCancelCommentButtonsVisible(true);
					}}
					placeholder="Enter a comment"
					value={commentInput}
					onChange={(e) => setCommentInput(e.target.value)}
				/>
				{(cancelCommentButtonsVisible ||
					isFirstLevelComment ||
					isSecondLevelComment ||
					commentFormToEditVisible ||
					commentFormToReplyVisible) && (
					<div className="buttons">
						<button className="cancel" onClick={cancelHandler}>
							Cancel
						</button>
						<button
							type="submit"
							className="submit"
							disabled={commentInput.length <= 0}
						>
							{commentFormToEditVisible ? "Save" : "Comment"}
						</button>
					</div>
				)}
			</form>
		</article>
	);
};

export default CommentForm;
