import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "tinomuzambi@gmail.com",
			pass: "",
		},
	});
};
