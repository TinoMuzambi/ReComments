import mongoose, { Schema } from "mongoose";

import { HomeModel } from "../interfaces";

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
	mongoose.model<HomeModel>("Home", HomeSchema);
