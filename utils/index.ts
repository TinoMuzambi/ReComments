import { Dispatch, SetStateAction } from "react";
import { CommentModel, HomeModel, UserModel } from "../interfaces";

const instanceOfCommentModel: Function = (
	object: any
): object is CommentModel => {
	// Check if object is of type CommentModel.
	return (
		"id" in object &&
		"videoId" in object &&
		"authorId" in object &&
		"name" in object &&
		"email" in object &&
		"image" in object &&
		"comment" in object &&
		"edited" in object
	);
};

export const postUpdatedResourceToDb: Function = async (
	body: CommentModel & UserModel,
	commentId?: string
): Promise<void> => {
	// Determine whether resource is comment or user and post resource to db.
	if (instanceOfCommentModel(body)) {
		await fetch(`/api/comments/${commentId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
	} else {
		await fetch(`/api/users/${body.userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
	}
};

export const postNewUserToDb: Function = async (
	body: UserModel
): Promise<void> => {
	// Post new user to db.
	await fetch("/api/users", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
};

export const postNewCommentToDb = async (body: CommentModel): Promise<void> => {
	// Post new comment to db.
	await fetch("/api/comments", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
};

export const VOTING_TYPES = {
	// Different types of liking/unliking.
	upvoting: "upvoting",
	downvoting: "downvoting",
	undoUpvoting: "undoUpvoting",
	undoDownvoting: "undoDownvoting",
};

export const ROLES = {
	// Different types of user roles.
	admin: "admin",
	standard: "standard",
	moderator: "moderator",
};

export const numberWithCommas: Function = (num: number): string => {
	// Format number to have commas to make it more readable.
	return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export const shuffle: Function = (array: string[]): string[] => {
	// Shuffle array "randomly".
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
	url: string,
	title: string
) => {
	// Send email to recipient.
	try {
		const body = {
			to,
			fromName,
			commentText,
			url: "https://youtube.com/watch?v=" + url,
			title: title.substring(0, title.indexOf("| ReComments") - 1),
		};
		await fetch("/api/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
	} catch (error) {}
};

export const getUpdatedVoteCommentBody: Function = (
	voteType: string,
	comment: CommentModel
): CommentModel => {
	// Get correct body for upvoting/downvoting.
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

export const getDbComments: Function = async (url: string): Promise<any> => {
	// Get the comments for the current video from the database.
	const BASE_URL =
		process.env.NODE_ENV === "production"
			? "https://recomments.tinomuzambi.com"
			: "http://localhost:3000";
	let res: any;

	res = await fetch(`${BASE_URL}/api/comments/video/${url}`, {
		headers: {
			"Content-Type": "application/json",
		},
	});
	const comments = await res.json();

	return comments;
};

export const getDbUser: Function = async (
	user: gapi.client.people.Person,
	setDbUser: Function
): Promise<void> => {
	// Get the current user from the db.
	if (user && user.emailAddresses) {
		const res = await fetch(
			`/api/users/${user?.emailAddresses[0].metadata?.source?.id}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const data = await res.json();

		if (setDbUser) setDbUser(data.data);
		return data;
	}
};

export const getHtml: Function = (title: string, html: string): string => {
	// Get html for sending email.
	return `
		<head>
			<title>${title} | ReComments</title>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</head>
		<header>
			<img src="https://a.storyblok.com/f/114267/1080x1080/b66aa450e5/recomments.png" alt="logo"/>
		</header>
		<main>
			${html}

			<div class="bar" />
		</main>
		<style>
			@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;700;900&display=swap");

			* {
				font-family: "Poppins", sans-serif;
			}

			header img {
				height: 100px;
			}

			body {
				padding: 2rem;
			}

			a {
				color: rgb(61, 166, 255);
			}

			b {
				color:  #ffa500;
			}

			blockquote {
				background: #f9f9f9;
				border-left: 10px solid #ccc;
				margin: 1.5em 10px;
				padding: 0.5em 10px;
				white-space: pre-wrap;
			}

			blockquote:before {
				color: #ccc;
				content: open-quote;
				font-size: 4em;
				line-height: .1em;
				margin-right: .25em;
				vertical-align: -.4em;
			}

			.bar {
				margin: 1rem 0;
				background: #ffa500;
				height: 2rem;
				width: 100%
			}
		</style>
	`;
};

export const hideNotice: Function = (
	setNoticeVisible: Dispatch<SetStateAction<boolean>>,
	setNoticeTitle: Dispatch<SetStateAction<string>>,
	setNoticeSubtitle: Dispatch<SetStateAction<string>>,
	setNoticeNoButtons: Dispatch<SetStateAction<1 | 2>>,
	setNoticeFirstButtonText: Dispatch<SetStateAction<string>>,
	setNoticeSecondButtonText: Dispatch<SetStateAction<string>>
) => {
	// Hide notice and reset notice fields.
	setNoticeVisible(false);
	setNoticeTitle("");
	setNoticeSubtitle("");
	setNoticeNoButtons(1);
	setNoticeFirstButtonText("");
	setNoticeSecondButtonText("");
};

export const getNewVideoCommentsBody: Function = (
	body: CommentModel,
	videoComments: CommentModel[],
	doDelete: boolean,
	doVote: boolean
): CommentModel[] => {
	// Get new body for the current video's comments when an update occurs.
	let currVideoComments: CommentModel[] = videoComments ? videoComments : [];

	if (doDelete) {
		currVideoComments = currVideoComments.filter(
			(item: CommentModel) => item.id !== body.id
		);
	} else if (doVote) {
		for (let i = 0; i < currVideoComments.length; i++) {
			for (
				let j = 0;
				j < (currVideoComments[i].replies as CommentModel[]).length;
				j++
			) {
				if (
					(currVideoComments[i].replies as CommentModel[])[j].id === body.id
				) {
					(currVideoComments[i].replies as CommentModel[])[j] = body;
					break;
				}
			}
		}
	} else {
		for (let i = 0; i < currVideoComments.length; i++) {
			if (currVideoComments[i].id === body.id) {
				currVideoComments[i] = body;
				break;
			}
		}
	}

	return currVideoComments;
};

export const clearWatchHistory: Function = async (
	setSpinnerVisible: Dispatch<SetStateAction<boolean>>,
	dbUser: UserModel,
	setDbUser: Function,
	hideNoticeWrapper: Function,
	setNoticeTitle: Dispatch<SetStateAction<string>>,
	setNoticeSubtitle: Dispatch<SetStateAction<string>>,
	setNoticeNoButtons: Dispatch<SetStateAction<1 | 2>>,
	setNoticeFirstButtonText: Dispatch<SetStateAction<string>>
) => {
	setSpinnerVisible(true);
	if (dbUser) {
		const newBody: UserModel = {
			...dbUser,
			watchhistory: [],
		};

		try {
			await postUpdatedResourceToDb(newBody);
			if (setDbUser) setDbUser(newBody);
			hideNoticeWrapper();
			setNoticeTitle("Watch history cleared");
			setNoticeSubtitle("Your watch history has been cleared");
			setNoticeNoButtons(1);
			setNoticeFirstButtonText("Ok");
		} catch (error) {
			hideNoticeWrapper();
			setNoticeTitle("Watch history not cleared");
			setNoticeSubtitle("Something went wrong. Please contact the developer.");
			setNoticeNoButtons(1);
			setNoticeFirstButtonText("Ok");
		}
	}
	setSpinnerVisible(false);
};
export const deleteUser: Function = async (id: string) => {
	await fetch(`/api/users/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
	// TODO Delete user comments.
	await fetch(`/api/comments/video/purge/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const updateHomeVideos: Function = async (body: HomeModel) => {
	await fetch("/api/home", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
};
