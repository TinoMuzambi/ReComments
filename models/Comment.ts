import mongoose, { Schema } from "mongoose";

import { CommentModel } from "../interfaces";

const CommentSchema: Schema = new mongoose.Schema(
	{
		authorId: {
			type: String,
			required: [true, "Comment needs an author."],
			trim: true,
		},
		text: {
			type: String,
			required: [true, "Comment needs comment text."],
		},
		videoId: {
			type: String,
			ref: "Video",
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Comment ||
	mongoose.model<CommentModel>("Comment", CommentSchema);
