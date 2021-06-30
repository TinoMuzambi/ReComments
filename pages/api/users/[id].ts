import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";
import { UserModel } from "../../../interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const {
		query: { id },
		method,
	} = req;

	switch (method) {
		case "GET":
			try {
				const user: UserModel = await User.findOne({ userId: id });

				if (!user) {
					return res
						.status(404)
						.json({ success: false, data: { message: "User not found" } });
				}

				res.status(200).json({
					success: true,
					data: user,
				});
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		case "PUT":
			try {
				const user: mongoose.UpdateQuery<any> = await User.updateOne(
					{ id: id },
					{ ...req.body }
				);

				if (!user) {
					return res
						.status(400)
						.json({ success: false, data: { message: "User not found" } });
				}
				res.status(200).json({ success: true, data: user });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		case "DELETE":
			try {
				const deletedUser = await User.deleteOne({ userId: id });

				if (!deletedUser) {
					return res
						.status(400)
						.json({ success: false, data: { message: "User not found" } });
				}
				res
					.status(200)
					.json({ success: true, data: { message: "User deleted" } });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
