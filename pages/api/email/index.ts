import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

import { getHtml } from "../../../utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { to, fromName, commentText, url, title } = req.body;

	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "recommentsweb@gmail.com",
			pass: process.env.GMAIL_PASS,
		},
	});

	const options = {
		from: "recommentsweb@gmail.com",
		to: to,
		subject: "ReComments | New reply to your comment",
		text: `${fromName} replied to your comment on ReComments. They said: "${commentText}". Paste this url ${url} in the search box on ReComments to continue the conversation.`,
		html: getHtml(
			"New Comment",
			`
				<h1>New reply to your comment on <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a></h1>
				<p><b>${fromName}</b> replied to your comment on <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a> on "${title}".</p>
				<p>They said:</p>
				<blockquote>${commentText}</blockquote>
				<p>Paste this url <a href=${url} target="_blank">${url}</a> in the search box on <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a> to continue the conversation.</p>
				
				<div class="unsub">
					<a href="https://recomments.tinomuzambi.com/api/users/emails?subscribe=false&email=${to}">Unsubscribe from these emails</a>
				</div>
			`
		),
	};

	try {
		const send: Function = async () => {
			const info = await transporter.sendMail(options);
			return res.status(200).json({ success: true, data: info });
		};
		send();
	} catch (error) {
		return res.status(400).json({ success: false, error: error });
	}
};
