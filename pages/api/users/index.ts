import { NextApiRequest, NextApiResponse } from "next";

import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";
import { requireGoogleIdentity } from "../../../utils/googleAuth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const { method } = req;

	switch (method) {
		case "GET":
			return res.status(403).json({
				success: false,
				message: "User enumeration is disabled",
			});
		case "POST":
			try {
				const identity = await requireGoogleIdentity(req, res);
				if (!identity) return;

				const existing = await User.findOne({ userId: identity.id });
				if (existing) {
					return res.status(200).json({ success: true, data: existing });
				}

				const user: typeof User = await User.create({
					userId: identity.id,
					email: identity.email,
					shortName: String(req.body.shortName || "User").slice(0, 100),
					name: String(req.body.name || req.body.shortName || "User").slice(0, 200),
					photoUrl: String(req.body.photoUrl || "").slice(0, 2000),
					upvotedIds: [],
					downvotedIds: [],
					emails: true,
					darkMode: false,
					watchhistory: [],
					role: "standard",
				});

				return res.status(201).json({ success: true, data: user });
			} catch (error) {
				return res.status(400).json({ success: false });
			}
		default:
			return res.status(400).json({ success: false });
	}
};
