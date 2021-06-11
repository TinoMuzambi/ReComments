import {
	useState,
	useContext,
	MouseEventHandler,
	FormEventHandler,
} from "react";
import { useRouter } from "next/router";

import { AppContext } from "../../context/AppContext";
import { CommentModel } from "../../interfaces";

const CommentForm: React.FC<Boolean | any> = ({
	replying,
	setReplying,
	id,
}) => {
	const [opened, setOpened] = useState(false);
	const [comment, setComment] = useState("");
	const { user } = useContext(AppContext);
	const router = useRouter();

	const cancelHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		setOpened(false);
		if (replying) {
			setReplying(false);
		}
	};

	const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const submitComment: Function = async () => {
			if (user && user.emailAddresses && user.names && user.photos) {
				let body: CommentModel = {
					videoId: router.query.url as string,
					authorId: user?.emailAddresses[0].metadata?.source?.id as string,
					email: user?.emailAddresses[0].value as string,
					name: user.names[0].givenName as string,
					comment: comment,
					image: user.photos[0].url as string,
				};

				try {
					if (replying) {
						const response = await fetch(`/api/comments/${id}`);
						let commentToUpdate = await response.json();
						commentToUpdate = commentToUpdate.data[0];
						body = {
							...commentToUpdate,
							replies: [body, ...commentToUpdate.replies],
						};

						await fetch(`/api/comments/${id}`, {
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(body),
						});
					} else {
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
						if (!replying) setOpened(true);
					}}
					placeholder="Enter a comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				{(opened || replying) && (
					<div className="buttons">
						<button className="cancel" onClick={cancelHandler}>
							Cancel
						</button>
						<button
							type="submit"
							className="submit"
							disabled={comment.length <= 0}
						>
							Comment
						</button>
					</div>
				)}
			</form>
		</article>
	);
};

export default CommentForm;
