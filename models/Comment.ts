import mongoose, { Schema } from "mongoose";

import { CommentModel } from "../interfaces";

const CommentSchema: Schema = new mongoose.Schema(
	{
		videoId: {
			type: String,
			required: [true, "Comment needs a video ID."],
			trim: true,
		},
		authorId: {
			type: String,
			required: [true, "Comment needs an author ID"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Comment needs an email"],
			trim: true,
		},
		comment: {
			type: String,
			required: [true, "Comment needs comment text."],
		},
		name: {
			type: String,
			required: [true, "Comment needs a name"],
			trim: true,
		},
		image: {
			type: String,
			trim: true,
			default:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSisT6Nb6XIXyX7kQ9XmEMID6eSxl4mQ8E0vXbwc77pJqhZYUUdU13h7VRlt4rZqOgg5Yc&usqp=CAU",
		},
		upvotes: {
			type: Number,
			default: 0,
		},
		downvotes: {
			type: Number,
			default: 0,
		},
		mention: {
			type: String || null,
			default: null,
		},
		replies: {
			type: [this],
		},
		edited: {
			type: Boolean,
			required: [true, "Comment needs edited value."],
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Comment ||
	mongoose.model<CommentModel>("Comment", CommentSchema);
