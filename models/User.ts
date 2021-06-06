import mongoose, { Schema } from "mongoose";

import { UserModel } from "../interfaces";

const UserSchema: Schema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: [true, "User needs an id."],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "User needs an email."],
		},
		shortName: {
			type: String,
			required: [true, "User needs a shortname."],
		},
		name: {
			type: String,
			required: [true, "User needs a name."],
		},
		photoUrl: {
			type: String,
			required: [true, "User needs a photo url."],
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.User ||
	mongoose.model<UserModel>("User", UserSchema);
