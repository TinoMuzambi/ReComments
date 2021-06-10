import {
	useState,
	useContext,
	MouseEventHandler,
	FormEventHandler,
} from "react";
import { AppContext } from "../../context/AppContext";

const CommentForm: React.FC<any> = () => {
	const [opened, setOpened] = useState(false);
	const [comment, setComment] = useState("");
	const { user } = useContext(AppContext);

	const cancelHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		setOpened(false);
	};

	const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		console.log("Submit");
	};

	return (
		<article className="form-holder">
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
