import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import nodemailer from "nodemailer";

import { getHtml } from "../../../utils";
import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";
import { requireGoogleIdentity } from "../../../utils/googleAuth";

const escapeHtml = (value: string): string =>
	value.replace(/[&<>'"]/g, (character) => {
		const entities: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"'": "&#39;",
			'"': "&quot;",
		};
		return entities[character];
	});

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ success: false });
	}

	const identity = await requireGoogleIdentity(req, res);
	if (!identity) return;
	await dbConnect();

	const sender = await User.findOne({ userId: identity.id });
	const recipient = await User.findOne({
		userId: String(req.body.recipientId || "").slice(0, 200),
	});
	if (!sender || !recipient) {
		return res.status(404).json({ success: false });
	}
	if (!recipient.emails) return res.status(204).end();

	const commentText = String(req.body.commentText || "").trim().slice(0, 5000);
	const title = String(req.body.title || "ReComments").trim().slice(0, 300);
	const url = String(req.body.url || "").trim().slice(0, 500);
	if (!commentText || !/^https:\/\/youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(url)) {
		return res.status(400).json({ success: false });
	}

	const gmailUser = process.env.GMAIL_USER;
	const gmailPassword = process.env.GMAIL_PASS;
	const preferenceSecret = process.env.EMAIL_PREFERENCE_SECRET || gmailPassword;
	if (!gmailUser || !gmailPassword || !preferenceSecret) {
		return res.status(503).json({ success: false, error: "Email is not configured" });
	}
	const preferenceToken = crypto
		.createHmac("sha256", preferenceSecret)
		.update(recipient.email)
		.digest("hex");
	const fromName = String(sender.shortName || sender.name || "Someone").slice(0, 100);
	const safeName = escapeHtml(fromName);
	const safeText = escapeHtml(commentText);
	const safeTitle = escapeHtml(title);
	const safeUrl = escapeHtml(url);

	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: gmailUser,
			pass: gmailPassword,
		},
	});

	const options = {
		from: gmailUser,
		to: recipient.email,
		subject: "ReComments | New reply to your comment",
		text: `${fromName} replied to your comment on ReComments. They said: "${commentText}". Paste this url ${url} in the search box on ReComments to continue the conversation.`,
		html: getHtml(
			"New Comment",
			`
				<h1>New reply to your comment on <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a></h1>
				<p><b>${safeName}</b> replied to your comment on <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a> on "${safeTitle}".</p>
				<p>They said:</p>
				<blockquote>${safeText}</blockquote>
				<p>Paste this url <a href="${safeUrl}" target="_blank">${safeUrl}</a> in the search box on <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a> to continue the conversation.</p>
				
				<div class="unsub">
					<a href="https://recomments.tinomuzambi.com/api/users/emails?subscribe=false&email=${encodeURIComponent(
						recipient.email
					)}&token=${preferenceToken}">Unsubscribe from these emails</a>
				</div>
			`
		),
	};

	try {
		const send: Function = async () => {
			await transporter.sendMail(options);
		};
		await send();
		return res.status(200).json({ success: true });
	} catch (error) {
		console.error("Reply notification failed", error);
		return res.status(502).json({ success: false });
	}
};
