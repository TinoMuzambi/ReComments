import { useState, useContext, MouseEventHandler } from "react";
import { AppContext } from "../../context/AppContext";

const CommentForm: React.FC<any> = () => {
	const [opened, setOpened] = useState(false);
	const { user } = useContext(AppContext);

	const cancelHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		setOpened(false);
	};

	const submitHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
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
			<form className="form">
				<input
					type="text"
					className="text"
					onFocus={() => setOpened(true)}
					placeholder="Enter a comment"
				/>
				{opened && (
					<div className="buttons">
						<button className="cancel" onClick={cancelHandler}>
							Cancel
						</button>
						<button type="submit" onClick={submitHandler}>
							Comment
						</button>
					</div>
				)}
			</form>
		</article>
	);
};

export default CommentForm;
