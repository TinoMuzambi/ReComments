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
	replying,
	editing,
	setEditing,
	replyReplying,
	setReplying,
	id,
	setOpenedProp,
	commentProp,
}) => {
	const [opened, setOpened] = useState(false);
	const [comment, setComment] = useState("");
	const { user } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (replyReplying) {
			if (user && user.names) {
				setComment(`@${user.names[0].givenName as string} `);
			}
		}
	}, [replyReplying]);

	useEffect(() => {
		if (editing) {
			setComment(commentProp.comment);
		}
	}, [editing]);

	const cancelHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		setOpened(false);
		if (replying || replyReplying) {
			setReplying(false);
		}
		if (editing) {
			setReplying(false);
			return setEditing(false);
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
					if (editing) {
						const response = await fetch(`/api/comments/${id}`);
						let commentToUpdate = await response.json();
						commentToUpdate = commentToUpdate.data[0];

						body = {
							...commentToUpdate,
							edited: true,
							comment: comment,
							updatedAt: new Date(),
						};

						await fetch(`/api/comments/${id}`, {
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(body),
						});
						setOpenedProp(true);
						setReplying(false);
						setEditing(false);
					} else if (replying || replyReplying) {
						const response = await fetch(`/api/comments/${id}`);
						let commentToUpdate = await response.json();
						console.log(id);
						commentToUpdate = commentToUpdate.data[0];

						body = {
							...commentToUpdate,
							replies: [...commentToUpdate?.replies, body],
						};

						if (replyReplying)
							body = {
								...commentToUpdate,
								replies: [
									...commentToUpdate?.replies,
									{ ...body, mention: `@${user.names[0].givenName as string}` },
								],
							};

						await fetch(`/api/comments/${id}`, {
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(body),
						});
						setOpenedProp(true);
						setReplying(false);
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
					setOpened(false);
					window.scrollTo(0, height);
				} catch (error) {
					console.error(error);
				}
			}
		};
		submitComment();
	};

	return (
		<article className={`comment-form-holder ${replying && "sm"}`}>
			{user && user.photos && user.names && (
				<img
					src={user?.photos[0].url}
					alt={user?.names[0].givenName}
					className={`profile ${replying && "sm"}`}
				/>
			)}
			<form className="comment-form" onSubmit={submitHandler}>
				<textarea
					className={`text ${replying && "sm"}`}
					onFocus={() => {
						if (!replying && !replyReplying) setOpened(true);
					}}
					placeholder="Enter a comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				{(opened || replying || replyReplying || editing) && (
					<div className="buttons">
						<button className="cancel" onClick={cancelHandler}>
							Cancel
						</button>
						<button
							type="submit"
							className="submit"
							disabled={comment.length <= 0}
						>
							{editing ? "Save" : "Comment"}
						</button>
					</div>
				)}
			</form>
		</article>
	);
};

export default CommentForm;
