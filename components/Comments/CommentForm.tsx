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

const CommentForm: React.FC<CommentFormProps> = ({
	isFirstLevelComment,
	commentFormToEditVisible,
	commentFormToReplyVisible,
	setCommentFormToEditVisible,
	isSecondLevelComment,
	setCommentFormToReplyVisible,
	setIsViewMoreExpanded,
	currComment,
}) => {
	const [cancelCommentButtonsVisible, setCancelCommentButtonsVisible] =
		useState(false);
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
						if (currComment) {
							// Edit comment.
							const response = await fetch(`/api/comments/${currComment._id}`);
							let commentToUpdate = await response.json();
							commentToUpdate = commentToUpdate.data[0];

							body = {
								...commentToUpdate,
							};
							if (isSecondLevelComment || isFirstLevelComment) {
								// Editing replies.
								console.log(body);
								if (body && body.replies) {
									for (let i = 0; i < body.replies.length; i++) {
										if (body.replies[i]._id === currComment._id) {
											let newReplies = commentToUpdate.replies;
											newReplies[i] = {
												...newReplies[i],
												comment: commentInput,
												edited: true,
												updatedAt: new Date(),
											};
											body = { ...commentToUpdate, replies: newReplies };
											console.log(body);
											break;
										}
									}
								}
							} else {
								// Editing top level comment.
								body = {
									...commentToUpdate,
									edited: true,
									comment: commentInput,
									updatedAt: new Date(),
								};
							}

							// Post update to DB.
							await fetch(`/api/comments/${currComment._id}`, {
								method: "PUT",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify(body),
							});
							if (setIsViewMoreExpanded) setIsViewMoreExpanded(true);
							if (setCommentFormToReplyVisible)
								setCommentFormToReplyVisible(false);
							if (setCommentFormToEditVisible)
								setCommentFormToEditVisible(false);
						}
					} else if (isFirstLevelComment || isSecondLevelComment) {
						if (currComment) {
							// Reply to comment.
							const response = await fetch(`/api/comments/${currComment._id}`);
							// Get comment to update.
							let commentToUpdate = await response.json();
							console.log(currComment._id);
							commentToUpdate = commentToUpdate.data[0];

							body = {
								...commentToUpdate,
								replies: [...commentToUpdate?.replies, body],
							};

							if (isSecondLevelComment)
								// Add mention if second level comment.
								body = {
									...commentToUpdate,
									replies: [
										...commentToUpdate?.replies,
										{
											...body,
											mention: `@${user.names[0].givenName as string}`,
										},
									],
								};

							// Post updated comment to DB.
							await fetch(`/api/comments/${currComment._id}`, {
								method: "PUT",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify(body),
							});
							if (setIsViewMoreExpanded) setIsViewMoreExpanded(true);
							if (setCommentFormToReplyVisible)
								setCommentFormToReplyVisible(false);
						}
					} else {
						// Post new comment to DB.
						await fetch("/api/comments", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(body),
						});
					}

					// Refresh then scroll to same place on the page.
					const height = window.scrollY;
					await router.replace(router.asPath);
					setCommentInput("");
					setCancelCommentButtonsVisible(false);
					window.scrollTo(0, height);
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
