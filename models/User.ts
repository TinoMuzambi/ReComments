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
			unique: true,
			trim: true,
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
			trim: true,
			default:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSisT6Nb6XIXyX7kQ9XmEMID6eSxl4mQ8E0vXbwc77pJqhZYUUdU13h7VRlt4rZqOgg5Yc&usqp=CAU",
		},
		upvotedIds: {
			type: [String],
			default: [],
		},
		downvotedIds: {
			type: [String],
			default: [],
		},
		emails: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.User ||
	mongoose.model<UserModel>("User", UserSchema);
