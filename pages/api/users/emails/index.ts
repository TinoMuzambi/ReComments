import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

import User from "../../../../models/User";
import dbConnect from "../../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	dbConnect();
	const {
		query: { email, subscribe },
		method,
	} = req;

	switch (method) {
		case "GET":
			try {
				const user: mongoose.UpdateQuery<any> = await User.updateOne(
					{ email: email },
					{ emails: subscribe }
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
		default:
			return res.status(400).json({ success: false });
	}
};
