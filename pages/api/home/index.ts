import { NextApiRequest, NextApiResponse } from "next";

import Home from "../../../models/HomeVideo";
import dbConnect from "../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const videos: typeof Home[] = await Home.find({});

				res.status(200).json({ success: "true", data: videos });
			} catch (error) {
				res.status(400).json({ success: "false", data: error });
			}
			break;
		case "POST":
			try {
				const videos: typeof Home = await Home.create(req.body);

				res.status(201).json({ success: "true", data: videos });
			} catch (error) {
				res.status(400).json({ success: "false", data: error });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
