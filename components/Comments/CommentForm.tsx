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
import { postUpdatedResourceToDb, sendMail } from "../../utils";
import Spinner from "../Spinner";

const CommentForm: React.FC<CommentFormProps> = ({
	commentFormToEditVisible,
	commentFormToReplyVisible,
	setCommentFormToEditVisible,
	isSecondLevelComment,
	setCommentFormToReplyVisible,
	setIsViewMoreExpanded,
	currComment,
	originalComment,
}): JSX.Element => {
	const [cancelCommentButtonsVisible, setCancelCommentButtonsVisible] =
		useState(commentFormToEditVisible || commentFormToReplyVisible);
	const [commentInput, setCommentInput] = useState("");
	const [spinnerVisible, setSpinnerVisible] = useState(false);

	const { user } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (isSecondLevelComment) {
			if (user && user.names) {
				if (currComment) setCommentInput(`@${currComment.name} `);
			}
		}
	}, [isSecondLevelComment]);

	useEffect(() => {
		if (commentFormToEditVisible) {
			if (currComment) setCommentInput(currComment.comment);
		}
	}, [commentFormToEditVisible]);

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

	const cancelHandler: MouseEventHandler<HTMLButtonElement> = (e): void => {
		e.preventDefault();
		setCancelCommentButtonsVisible(false);
		if (setCommentFormToReplyVisible) setCommentFormToReplyVisible(false);
		if (setCommentFormToReplyVisible) setCommentFormToReplyVisible(false);
		if (setCommentFormToEditVisible) setCommentFormToEditVisible(false);
	};

	const submitHandler: FormEventHandler<HTMLFormElement> = (e): void => {
		e.preventDefault();

		const submitComment: Function = async (): Promise<void> => {
			setSpinnerVisible(true);
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
							if (isSecondLevelComment) {
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
									await postUpdatedResourceToDb(body, originalComment._id);
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
							await postUpdatedResourceToDb(body, currComment._id);

							// Hide forms and expand view more.
							if (setIsViewMoreExpanded) setIsViewMoreExpanded(true);
							if (setCommentFormToReplyVisible)
								setCommentFormToReplyVisible(false);
							if (setCommentFormToEditVisible)
								setCommentFormToEditVisible(false);
						}
					} else if (isSecondLevelComment || commentFormToReplyVisible) {
						if (currComment && currComment.replies) {
							// Reply to comment.
							if (isSecondLevelComment) {
								// Add mention if second level comment.
								body = {
									...currComment,
									replies: [
										...currComment?.replies,
										{
											...body,
											comment: commentInput.replace(
												"@" + currComment.name + " ",
												""
											),
											mention: `@${currComment.name}`,
										},
									],
								};

								sendMail(
									currComment.email,
									user.names[0].givenName,
									commentInput.replace(
										(("@" + user.names[0].givenName) as string) + " ",
										""
									),
									router.query.url
								);
							} else {
								body = {
									...currComment,
									replies: [...currComment?.replies, body],
								};
							}

							// Post updated comment to DB.
							await postUpdatedResourceToDb(body, currComment._id);

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
			setSpinnerVisible(false);
		};
		submitComment();
	};

	return (
		<article className={`comment-form-holder ${isSecondLevelComment && "sm"}`}>
			{user && user.photos && user.names && (
				<img
					src={user?.photos[0].url}
					alt={user?.names[0].givenName}
					className={`profile ${isSecondLevelComment && "sm"}`}
				/>
			)}
			<form className="comment-form" onSubmit={submitHandler}>
				<textarea
					className={`text ${isSecondLevelComment && "sm"}`}
					onFocus={() => {
						if (!isSecondLevelComment) setCancelCommentButtonsVisible(true);
					}}
					placeholder="Enter a comment"
					value={commentInput}
					onChange={(e) => setCommentInput(e.target.value)}
				/>
				{(cancelCommentButtonsVisible ||
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
							{commentFormToEditVisible
								? "Save"
								: commentFormToReplyVisible
								? "Reply"
								: "Comment"}
						</button>
					</div>
				)}
			</form>
			{spinnerVisible && <Spinner />}
		</article>
	);
};

export default CommentForm;
