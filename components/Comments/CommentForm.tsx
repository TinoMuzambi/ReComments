import { useState } from "react";

const CommentForm = () => {
	const [opened, setOpened] = useState(false);

	return (
		<article className="form-holder">
			<img src="" alt="" className="profile" />
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
