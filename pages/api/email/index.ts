import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { to, fromName, commentText, url } = req.body;
	console.log(to, fromName, commentText, url);
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
		text: `${fromName} replied to your comment on ReComments. They said: "${commentText}". Paste this url ${url} in the search box on ReComments to continue the conversation.`,
		html: `
			<header>
				<img src="https://a.storyblok.com/f/114267/1080x1080/b66aa450e5/recomments.png" alt="logo"/>
			</header>
			<main>
				<h1>New reply to your comment</h1>
				<br><br>
				<p>${fromName} replied to your comment on ReComments.</p>
				<p>They said:</p>
				<blockquote>${commentText}</blockquote>
				<p>Paste this url <a href=${url} target="_blank">${url}</a> in the search box on ReComments to continue the conversation.</p>
			</main>
			<style>
				* {
					font-family: sans-serif;
				}
			</style>
			`,
	};
	let error: Error,
		inf: SMTPTransport.SentMessageInfo | {} = {};

	try {
		transporter.sendMail(options, (err, info) => {
			if (err) {
				error = err;
			} else {
				inf = info;
			}
		});
	} catch (error) {
		return res.status(400).json({ success: false, error: error });
	}
	return res.status(200).json({ success: true, data: inf });
};
