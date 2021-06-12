import { CommentModel } from "../interfaces";

export const postUpdatedCommentToDb = async (
	body: CommentModel,
	comment: CommentModel
): Promise<void> => {
	if (comment) {
		await fetch(`/api/comments/${comment._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
	}
};
