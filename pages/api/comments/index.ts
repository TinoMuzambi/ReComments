import { NextApiRequest, NextApiResponse } from "next";

import Comment from "../../../models/Comment";
import dbConnect from "../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	dbConnect();
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const comments: Comment[] = await Comment.find({});

				res.status(200).json({ success: "true", data: comments });
			} catch (error) {
				res.status(400).json({ success: "false" });
			}
			break;
		case "POST":
			try {
				console.log(req.body);
				const comment: Comment = await Comment.create(req.body);

				res.status(201).json({ success: "true", data: comment });
			} catch (error) {
				console.log(error);
				res.status(400).json({ success: "false" });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
