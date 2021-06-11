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
import { CommentModel } from "../../interfaces";

const CommentForm: React.FC<Boolean | any> = ({
	isFirstLevelComment,
	commentFormToEditVisible,
	setCommentFormToEditVisible,
	isSecondLevelComment,
	setCommentFormToReplyVisible,
	setIsViewMoreExpanded,
	currComment,
}) => {
	const [cancelCommentButtonsVisible, setCancelCommentButtonsVisible] =
		useState(false);
	const [comment, setComment] = useState("");
	const { user } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (isSecondLevelComment) {
			if (user && user.names) {
				setComment(`@${user.names[0].givenName as string} `);
			}
		}
	}, [isSecondLevelComment]);

	useEffect(() => {
		if (commentFormToEditVisible) {
			setComment(currComment.comment);
		}
	}, [commentFormToEditVisible]);

	const cancelHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		setCancelCommentButtonsVisible(false);
		if (isFirstLevelComment || isSecondLevelComment) {
			setCommentFormToReplyVisible(false);
		}
		if (commentFormToEditVisible) {
			setCommentFormToReplyVisible(false);
			return setCommentFormToEditVisible(false);
		}
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
					comment: comment,
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
						const response = await fetch(`/api/comments/${currComment._id}`);
						let commentToUpdate = await response.json();
						commentToUpdate = commentToUpdate.data[0];

						body = {
							...commentToUpdate,
						};
						if (isSecondLevelComment || isFirstLevelComment) {
							console.log(body);
							if (body && body.replies) {
								for (let i = 0; i < body.replies.length; i++) {
									if (body.replies[i]._id === currComment._id) {
										let newReplies = commentToUpdate.replies;
										newReplies[i] = {
											...newReplies[i],
											comment: comment,
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
							body = {
								...commentToUpdate,
								edited: true,
								comment: comment,
								updatedAt: new Date(),
							};
						}

						await fetch(`/api/comments/${currComment._id}`, {
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(body),
						});
						setIsViewMoreExpanded(true);
						setCommentFormToReplyVisible(false);
						setCommentFormToEditVisible(false);
					} else if (isFirstLevelComment || isSecondLevelComment) {
						const response = await fetch(`/api/comments/${currComment._id}`);
						let commentToUpdate = await response.json();
						console.log(currComment._id);
						commentToUpdate = commentToUpdate.data[0];

						body = {
							...commentToUpdate,
							replies: [...commentToUpdate?.replies, body],
						};

						if (isSecondLevelComment)
							body = {
								...commentToUpdate,
								replies: [
									...commentToUpdate?.replies,
									{ ...body, mention: `@${user.names[0].givenName as string}` },
								],
							};

						await fetch(`/api/comments/${currComment._id}`, {
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(body),
						});
						setIsViewMoreExpanded(true);
						setCommentFormToReplyVisible(false);
					} else {
						console.log(body);
						await fetch("/api/comments", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(body),
						});
					}
					const height = window.scrollY;
					await router.replace(router.asPath);
					setComment("");
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
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				{(cancelCommentButtonsVisible ||
					isFirstLevelComment ||
					isSecondLevelComment ||
					commentFormToEditVisible) && (
					<div className="buttons">
						<button className="cancel" onClick={cancelHandler}>
							Cancel
						</button>
						<button
							type="submit"
							className="submit"
							disabled={comment.length <= 0}
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
