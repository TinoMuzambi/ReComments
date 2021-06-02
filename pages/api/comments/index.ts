import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	res.json({ test: "test" });
};
