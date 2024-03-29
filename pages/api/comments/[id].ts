import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

import Comment from "../../../models/Comment";
import dbConnect from "../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const {
		query: { id },
		method,
	} = req;

	switch (method) {
		case "GET":
			try {
				const comment: Comment = await Comment.findOne({ id: id });

				if (!comment) {
					return res
						.status(404)
						.json({ success: false, data: { message: "Comment not found" } });
				}

				res.status(200).json({ success: true, data: comment });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		case "PUT":
			try {
				const comment: mongoose.UpdateQuery<any> = await Comment.updateOne(
					{ id: id },
					{ ...req.body }
				);

				if (!comment) {
					return res
						.status(400)
						.json({ success: false, data: { message: "Comment not found" } });
				}
				res.status(200).json({ success: true, data: comment });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		case "DELETE":
			try {
				const deletedComment = await Comment.deleteOne({ id: id });

				if (!deletedComment) {
					return res.status(400).json({ success: false });
				}
				res
					.status(200)
					.json({ success: true, data: { message: "Comment deleted" } });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
