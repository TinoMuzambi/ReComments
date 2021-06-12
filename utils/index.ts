import { CommentModel, UserModel } from "../interfaces";

function instanceOfCommentModel(object: any): object is CommentModel {
	return (
		"_id" in object &&
		"videoId" in object &&
		"authorId" in object &&
		"name" in object &&
		"email" in object &&
		"image" in object &&
		"comment" in object &&
		"edited" in object
	);
}

export const postUpdatedResourceToDb = async (
	body: CommentModel | UserModel,
	commentId?: string
): Promise<void> => {
	if (instanceOfCommentModel(body)) {
		await fetch(`/api/comments/${commentId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
	} else {
		await fetch(`/api/users/${body._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
	}
};

export const VOTING_TYPES = {
	upvoting: "upvoting",
	downvoting: "downvoting",
	undoUpvoting: "undoUpvoting",
	undoDownvoting: "undoDownvoting",
};
