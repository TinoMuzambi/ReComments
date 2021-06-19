import { CommentModel, UserModel } from "../interfaces";

const instanceOfCommentModel: Function = (
	object: any
): object is CommentModel => {
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
};

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

export const numberWithCommas: Function = (x: number): string => {
	return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export const shuffle: Function = (array: string[]): string[] => {
	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
};

export const sendMail: Function = async (
	to: string,
	fromName: string,
	commentText: string,
	url: string
) => {
	try {
		const body = {
			to: to,
			fromName: fromName,
			commentText: commentText,
			url: "https://youtube.com/watch?v=" + url,
		};
		await fetch("/api/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
	} catch (error) {
		console.error(error);
	}
};

export const getUpdatedVoteCommentBody: Function = (
	voteType: string,
	comment: CommentModel
): CommentModel => {
	if (voteType === VOTING_TYPES.upvoting)
		return { ...comment, upvotes: comment.upvotes + 1 };
	else if (voteType === VOTING_TYPES.downvoting)
		return { ...comment, downvotes: comment.downvotes + 1 };
	else if (voteType === VOTING_TYPES.undoUpvoting)
		return { ...comment, upvotes: comment.upvotes - 1 };
	else if (voteType === VOTING_TYPES.undoDownvoting)
		return { ...comment, downvotes: comment.downvotes - 1 };
	return comment;
};
