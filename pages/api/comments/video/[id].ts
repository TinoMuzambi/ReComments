import { NextApiRequest, NextApiResponse } from "next";

import Comment from "../../../../models/Comment";
import dbConnect from "../../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const {
		query: { id },
		method,
	} = req;

	switch (method) {
		case "GET":
			try {
				const comment: Comment[] = await Comment.find({ videoId: id }).sort(
					"-createdAt"
				);

				if (!comment || comment.length === 0) {
					return res
						.status(200)
						.json({ success: false, data: { message: "Comment not found" } });
				}

				res.status(200).json({ success: true, data: comment });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
