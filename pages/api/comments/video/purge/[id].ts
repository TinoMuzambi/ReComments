import { NextApiRequest, NextApiResponse } from "next";

import Comment from "../../../../../models/Comment";
import dbConnect from "../../../../../utils/dbConnect";
import { requireGoogleIdentity } from "../../../../../utils/googleAuth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const {
		query: { id },
		method,
	} = req;
	const authorId = Array.isArray(id) ? id[0] : id;

	switch (method) {
		case "DELETE":
			try {
				const identity = await requireGoogleIdentity(req, res);
				if (!identity) return;
				if (!authorId || identity.id !== authorId) {
					return res.status(403).json({ success: false });
				}
				const deletedComment = await Comment.deleteMany({ authorId });

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
