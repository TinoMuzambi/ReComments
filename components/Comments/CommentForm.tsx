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
import { CommentFormProps, CommentModel, UserModel } from "../../interfaces";
import {
	postUpdatedResourceToDb,
	postNewCommentToDb,
	sendMail,
} from "../../utils";
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

	const { dbUser } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (isSecondLevelComment) {
			// Prepend @ symbol if comment is a reply.
			if (currComment) setCommentInput(`@${currComment.name} `);
		}
	}, [isSecondLevelComment]);

	useEffect(() => {
		if (commentFormToEditVisible) {
			// If editing set comment input to comment text.
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

	const generateNewCommentBody: Function = (): CommentModel => ({
		_id: uuidv4(),
		videoId: router.query.url as string,
		authorId: dbUser?.userId as string,
		email: dbUser?.email as string,
		name: dbUser?.shortName as string,
		comment: commentInput,
		image: dbUser?.photoUrl as string,
		upvotes: 0,
		downvotes: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
		mention: null,
		edited: false,
	});

	const cancelHandler: MouseEventHandler<HTMLButtonElement> = (e): void => {
		e.preventDefault();

		setCancelCommentButtonsVisible(false);
		if (setCommentFormToReplyVisible) setCommentFormToReplyVisible(false);
		if (setCommentFormToEditVisible) setCommentFormToEditVisible(false);
	};

	const submitHandler: FormEventHandler<HTMLFormElement> = async (
		e
	): Promise<void> => {
		e.preventDefault();

		setSpinnerVisible(true);

		try {
			if (commentFormToEditVisible) {
				// Edit comment.
				if (currComment) {
					if (isSecondLevelComment && originalComment) {
						// Editing a reply.
						let body: CommentModel;
						body = {
							...originalComment,
						};

						// Editing replies.
						if (body && body.replies) {
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
									};
									body = { ...originalComment, replies: newReplies };
									break;
								}
							}
						}

						// Post update to DB.
						await postUpdatedResourceToDb(body, originalComment._id);
					} else {
						// Editing top level comment.
						let body: CommentModel = {
							...currComment,
							edited: true,
							comment: commentInput,
							updatedAt: new Date(),
						};

						// Post update to DB.
						await postUpdatedResourceToDb(body, currComment._id);
					}

					// Hide forms and expand view more.
					if (setIsViewMoreExpanded) setIsViewMoreExpanded(true);
					if (setCommentFormToReplyVisible) setCommentFormToReplyVisible(false);
					if (setCommentFormToEditVisible) setCommentFormToEditVisible(false);
				}
			} else if (isSecondLevelComment || commentFormToReplyVisible) {
				if (currComment) {
					// Reply to comment.
					if (
						isSecondLevelComment &&
						originalComment &&
						originalComment.replies
					) {
						// Add mention if second level comment.
						let body: CommentModel = {
							...originalComment,
						};

						const newBody: CommentModel = generateNewCommentBody();
						body = {
							...body,
							replies: [
								...originalComment?.replies,
								{
									...newBody,
									comment: commentInput.replace(
										"@" + currComment.name + " ",
										""
									),
									mention: `@${currComment.name}`,
								},
							],
						};

						await postUpdatedResourceToDb(body, originalComment._id);
					} else {
						// Don't add mention
						if (currComment.replies) {
							let body: CommentModel = {
								...currComment,
							};
							const newBody: CommentModel = generateNewCommentBody();

							body = {
								...body,
								replies: [...currComment?.replies, newBody],
							};
							await postUpdatedResourceToDb(body, currComment._id);
						}
					}

					// Notify user by email.
					const author = await fetch(`/api/users/${currComment.authorId}`);
					const authorJson = await author.json();
					const commentAuthor: UserModel = authorJson.data;

					if (commentAuthor?.emails) {
						sendMail(
							currComment.email,
							dbUser?.shortName,
							commentInput.replace(
								(("@" + dbUser?.shortName) as string) + " ",
								""
							),
							router.query.url,
							document.title
						);
					}

					// Hide forms and expand view more.
					if (setIsViewMoreExpanded) setIsViewMoreExpanded(true);
					if (setCommentFormToReplyVisible) setCommentFormToReplyVisible(false);
				}
			} else {
				// Post new comment to DB.
				let body: CommentModel = generateNewCommentBody();
				await postNewCommentToDb(body);
			}

			// Refresh then scroll to same place on the page.
			await scrollToSamePosition();
		} catch (error) {}
		setSpinnerVisible(false);
	};

	return (
		<article className={`comment-form-holder ${isSecondLevelComment && "sm"}`}>
			<img
				src={dbUser?.photoUrl}
				alt={dbUser?.shortName}
				className={`profile ${isSecondLevelComment && "sm"}`}
			/>

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
							CANCEL
						</button>
						<button
							type="submit"
							className="submit"
							disabled={commentInput.length <= 0}
						>
							{commentFormToEditVisible
								? "SAVE"
								: commentFormToReplyVisible
								? "REPLY"
								: "COMMENT"}
						</button>
					</div>
				)}
			</form>
			{spinnerVisible && <Spinner />}
		</article>
	);
};

export default CommentForm;
