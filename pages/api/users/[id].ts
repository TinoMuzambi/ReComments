import { NextApiRequest, NextApiResponse } from "next";

import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	dbConnect();
	const {
		query: { id },
		method,
	} = req;

	switch (method) {
		case "GET":
			try {
				const user: typeof User = await User.findOne({ userId: id });

				if (!user) {
					return res.status(404).json({ success: false });
				}

				res.status(200).json({ success: true, data: user });
			} catch (error) {
				return res.status(400).json({ success: false });
			}
			break;
		case "PUT":
			try {
				const user: typeof User[] = await User.findByIdAndUpdate(id, req.body, {
					new: true,
					runValidators: true,
				});

				if (!user) {
					return res.status(400).json({ success: false });
				}
				res.status(200).json({ success: true, data: user });
			} catch (error) {
				return res.status(400).json({ success: false });
			}
			break;
		case "DELETE":
			try {
				const deletedUser = await User.deleteOne({ _id: id });

				if (!deletedUser) {
					return res.status(400).json({ success: false });
				}
				res.status(200).json({ success: true, data: {} });
			} catch (error) {
				return res.status(400).json({ success: false });
			}
			break;
		default:
			return res.status(400).json({ success: false });
			break;
	}
};
