import {
	useState,
	useContext,
	MouseEventHandler,
	FormEventHandler,
} from "react";
import { useRouter } from "next/router";

import { AppContext } from "../../context/AppContext";
import { CommentModel } from "../../interfaces";

const CommentForm: React.FC<any> = () => {
	const [opened, setOpened] = useState(false);
	const [comment, setComment] = useState("");
	const { user } = useContext(AppContext);
	const router = useRouter();

	const cancelHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		setOpened(false);
	};

	const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const submitComment: Function = async () => {
			if (user && user.emailAddresses && user.names && user.photos) {
				const body: CommentModel = {
					videoId: router.query.url as string,
					authorId: user?.emailAddresses[0].metadata?.source?.id as string,
					email: user?.emailAddresses[0].value as string,
					name: user.names[0].givenName as string,
					comment: comment,
					image: user.photos[0].url as string,
				};

				try {
					await fetch("/api/comments", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(body),
					});
					await router.replace(router.asPath);
					setComment("");
					window.scrollTo({ top: document.body.scrollHeight });
				} catch (error) {
					console.error(error);
				}
			}
		};
		submitComment();
	};

	return (
		<article className="comment-form-holder">
			{user && user.photos && user.names && (
				<img
					src={user?.photos[0].url}
					alt={user?.names[0].givenName}
					className="profile"
				/>
			)}
			<form className="comment-form" onSubmit={submitHandler}>
				<textarea
					className="text"
					onFocus={() => setOpened(true)}
					placeholder="Enter a comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				{opened && (
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
