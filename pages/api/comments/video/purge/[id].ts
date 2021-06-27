import { NextApiRequest, NextApiResponse } from "next";

import Comment from "../../../../../models/Comment";
import dbConnect from "../../../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const {
		query: { id },
		method,
	} = req;

	switch (method) {
		case "DELETE":
			try {
				const deletedComment = await Comment.deleteMany({ authorId: id });

				if (!deletedComment) {
					return res.status(400).json({ success: false });
				}
				res
					.status(200)
					.json({ success: true, data: { message: "Comments deleted" } });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
