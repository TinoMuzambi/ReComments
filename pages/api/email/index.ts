import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { to, fromName, commentText, url } = req.body;
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "tinomuzambi@gmail.com",
			pass: process.env.GMAIL_PASS,
		},
	});

	const options = {
		from: "tinomuzambi@gmail.com",
		to: to,
		subject: "New reply to your comment",
		text: `${fromName} replied to your comment on ReComments. Paste this url ${url} in the search box on ReComments to view the reply.`,
		html: `
			<header>
				<img src="https://a.storyblok.com/f/114267/1080x1080/b66aa450e5/recomments.png" alt="logo"/>
			</header>
			<main>
				<h1>New reply to your comment</h1>
				<br><br>
				<p>${fromName} replied to your comment on ReComments.</p>
				<p>Paste this url <a href=${url} target="_blank">${url}</a> in the search box on ReComments to view the reply.</p>
			</main>`,
	};

	transporter.sendMail(options, (err, info) => {
		if (err) {
			return res.status(400).json({ success: false, error: err });
		}
		res.status(200).json({ success: true, data: info });
	});
};
