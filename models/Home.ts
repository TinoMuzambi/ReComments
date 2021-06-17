import mongoose, { Schema } from "mongoose";

const HomeSchema: Schema = new mongoose.Schema(
	{
		videos: {
			type: [String],
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Home ||
	mongoose.model<CommentModel>("Home", HomeSchema);
