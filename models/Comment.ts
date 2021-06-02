import mongoose, { Schema } from "mongoose";

interface IResource extends Document {
	title: string;
	url: string;
	date: Date;
	description: String;
	datePublished: String | Date;
}

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

export default mongoose.model<IResource>("Comment", CommentSchema);
