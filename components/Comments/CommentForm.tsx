import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const CommentForm: React.FC<any> = () => {
	const [opened, setOpened] = useState(false);
	const { user } = useContext(AppContext);

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
				<input type="text" className="text" onFocus={() => setOpened(true)} />
				{opened && (
					<div className="buttons">
						<button className="cancel">Cancel</button>
						<button type="submit">Comment</button>
					</div>
				)}
			</form>
		</article>
	);
};

export default CommentForm;
