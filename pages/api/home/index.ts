import { NextApiRequest, NextApiResponse } from "next";

import { HomeModel } from "../../../interfaces";
import Home from "../../../models/HomeVideo";
import dbConnect from "../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const { method } = req;

	switch (method) {
		case "GET":
			let getVideos: HomeModel | null = null;
			try {
				getVideos = await Home.findOne({ _id: "6756cadb665d3d4e3c52b1f1" });

				res.status(200).json({ success: true, data: getVideos });
			} catch (error) {
				res.status(400).json({ success: false, data: { error, getVideos } });
			}
			break;
		case "PUT":
		case "POST":
			return res.status(403).json({
				success: false,
				message: "Home video administration is disabled",
			});
		default:
			return res.status(400).json({ success: false });
	}
};
