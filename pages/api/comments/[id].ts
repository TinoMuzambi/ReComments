import { NextApiRequest, NextApiResponse } from "next";

import Comment from "../../../models/Comment";
import dbConnect from "../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		query: { id },
		method,
	} = req;

	switch (method) {
		case "GET":
			try {
				const comment = await Comment.findById(id);

				if (!comment) {
					return res.status(400).json({ success: false });
				}

				res.status(200).json({ success: true, data: comment });
			} catch (error) {
				return res.status(400).json({ success: false });
			}
			break;
		case "PUT":
			try {
				const comment = await Comment.findByIdAndUpdate(id, req.body, {
					new: true,
					runValidators: true,
				});

				if (!comment) {
					return res.status(400).json({ success: false });
				}
				res.status(200).json({ success: true, data: comment });
			} catch (error) {
				return res.status(400).json({ success: false });
			}
			break;
	}
};
