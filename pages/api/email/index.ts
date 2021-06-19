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
		subject: "ReComments | New reply to your comment",
		text: `${fromName} replied to your comment on ReComments. They said: "${commentText}". Paste this url ${url} in the search box on ReComments to continue the conversation.`,
		html: `
			<header>
				<img src="https://a.storyblok.com/f/114267/1080x1080/b66aa450e5/recomments.png" alt="logo"/>
			</header>
			<main>
				<h1>New reply to your comment on ReComments</h1>
				<p><b>${fromName}</b> replied to your comment on ReComments.</p>
				<p>They said:</p>
				<blockquote>${commentText}</blockquote>
				<p>Paste this url <a href=${url} target="_blank">${url}</a> in the search box on <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a> to continue the conversation.</p>
			</main>
			<style>
				* {
					font-family: sans-serif;
				}

				header img {
					height: 100px;
				}

				blockquote {
					background:#f9f9f9;
					border-left:10px solid #ccc;
					margin:1.5em 10px;
					padding:.5em 10px;
					white-space: pre-wrap;
				}

				blockquote:before {
					color:#ccc;
					content:open-quote;
					font-size:4em;
					line-height:.1em;
					margin-right:.25em;
					vertical-align:-.4em;
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
		return res.status(200).json({ success: true, data: inf });
	} catch (error) {
		return res.status(400).json({ success: false, error: error });
	}
};
