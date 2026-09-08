import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";
import { requireGoogleIdentity } from "../../../utils/googleAuth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const {
		query: { id },
		method,
	} = req;
	const userId = Array.isArray(id) ? id[0] : id;
	const identity = await requireGoogleIdentity(req, res);
	if (!identity) return;
	if (!userId || userId !== identity.id) {
		return res.status(403).json({ success: false, data: { message: "Not authorized" } });
	}

	switch (method) {
		case "GET":
			try {
				const user = await User.findOne({ userId });

				if (!user) {
					return res
						.status(404)
						.json({ success: false, data: { message: "User not found" } });
				}

				res.status(200).json({
					success: true,
					data: user,
				});
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		case "PUT":
			try {
				const update = {
					shortName: String(req.body.shortName || "").slice(0, 100),
					name: String(req.body.name || "").slice(0, 200),
					photoUrl: String(req.body.photoUrl || "").slice(0, 2000),
					emails: Boolean(req.body.emails),
					darkMode: Boolean(req.body.darkMode),
					watchhistory: Array.isArray(req.body.watchhistory)
						? req.body.watchhistory.slice(0, 1000)
						: [],
				};
				const user: mongoose.UpdateQuery<any> = await User.updateOne(
					{ userId },
					{ $set: update }
				);

				if (!user) {
					return res
						.status(400)
						.json({ success: false, data: { message: "User not found" } });
				}
				res.status(200).json({ success: true, data: user });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		case "DELETE":
			try {
				const deletedUser = await User.deleteOne({ userId });

				if (!deletedUser) {
					return res
						.status(400)
						.json({ success: false, data: { message: "User not found" } });
				}
				res
					.status(200)
					.json({ success: true, data: { message: "User deleted" } });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
