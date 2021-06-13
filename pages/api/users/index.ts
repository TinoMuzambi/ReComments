import { NextApiRequest, NextApiResponse } from "next";

import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	dbConnect();
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const users: typeof User[] = await User.find({});

				res.status(200).json({ success: "true", data: users });
			} catch (error) {
				res.status(400).json({ success: "false", data: error });
			}
			break;
		case "POST":
			try {
				const user: typeof User = await User.create(req.body);

				res.status(201).json({ success: "true", data: user });
			} catch (error) {
				res.status(400).json({ success: "false", data: error });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
