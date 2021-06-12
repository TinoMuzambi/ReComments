import { CommentModel, UserModel } from "../interfaces";

export const postUpdatedResourceToDb = async (
	body: CommentModel | UserModel,
	resource: "comment" | "user",
	comment?: CommentModel
): Promise<void> => {
	if (resource === "comment") {
		if (comment) {
			await fetch(`/api/comments/${comment._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});
		}
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
