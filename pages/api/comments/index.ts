import { NextApiRequest, NextApiResponse } from "next";

import Comment from "../../../models/Comment";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import { requireGoogleIdentity } from "../../../utils/googleAuth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const comments: Comment[] = await Comment.find({})
					.select("-email -replies.email")
					.sort({ updatedAt: -1 });

				res.status(200).json({ success: true, data: comments });
			} catch (error) {
				res.status(400).json({ success: false, data: error });
			}
			break;
		case "POST":
			try {
				const identity = await requireGoogleIdentity(req, res);
				if (!identity) return;
				const user = await User.findOne({ userId: identity.id });
				if (!user) return res.status(403).json({ success: false });

				const text = String(req.body.comment || "").trim().slice(0, 5000);
				const videoId = String(req.body.videoId || "").trim().slice(0, 32);
				const commentId = String(req.body.id || "").trim().slice(0, 100);
				if (!commentId || !text || !videoId) {
					return res.status(400).json({ success: false });
				}

				const comment: Comment = await Comment.create({
					id: commentId,
					videoId,
					authorId: identity.id,
					email: identity.email,
					name: user.shortName,
					image: user.photoUrl,
					comment: text,
					upvotes: 0,
					downvotes: 0,
					mention: null,
					replies: [],
					edited: false,
				});

				return res.status(201).json({ success: true, data: comment });
			} catch (error) {
				return res.status(400).json({ success: false });
			}
		default:
			return res.status(400).json({ success: false });
	}
};
