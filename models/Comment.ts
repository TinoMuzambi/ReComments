import mongoose, { Schema } from "mongoose";
import ObjectId = Schema.Types.ObjectId;

interface IResource extends Document {
	title: string;
	url: string;
	type: ResourceTypes;
	data: any;
	date: Date;
	description: String;
	datePublished: String | Date;
	ratings: IRatings;
	lecturerRating?: [IRating];
	studentRating?: [IRating];
	comments?: [IComment];
	tags?: [String];
	userRatings?: object;
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
			type: ObjectId,
			ref: "Video",
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IResource>("Comment", CommentSchema);
