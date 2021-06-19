import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "tinomuzambi@gmail.com",
			pass: process.env.GMAIL_PASS,
		},
	});

	const options = {
		from: "tinomuzambi@gmail.com",
		to: "t56muzambi@gmail.com",
		subject: "Test 1 2 3",
		text: "Tino is here.",
	};

	transporter.sendMail(options, (err, info) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log(info);
	});
};
