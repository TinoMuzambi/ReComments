import { NextApiRequest, NextApiResponse } from "next";

import Comment from "../../../models/Comment";
import dbConnect from "../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	dbConnect();
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const comments: Comment[] = await Comment.find({}).sort({
					updatedAt: -1,
				});

				res.status(200).json({ success: "true", data: comments });
			} catch (error) {
				res.status(400).json({ success: "false", data: error });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
