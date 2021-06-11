import { NextApiRequest, NextApiResponse } from "next";

import Comment from "../../../../models/Comment";
import dbConnect from "../../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	dbConnect();
	const {
		query: { id },
		method,
	} = req;

	switch (method) {
		case "GET":
			try {
				const comment: Comment[] = await Comment.find({ videoId: id });

				if (!comment) {
					return res.status(404).json({ success: false });
				}

				res.status(200).json({ success: true, data: comment });
			} catch (error) {
				return res.status(400).json({ success: false });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
