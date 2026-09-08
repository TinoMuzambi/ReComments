import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import mongoose from "mongoose";

import User from "../../../../models/User";
import dbConnect from "../../../../utils/dbConnect";
import { getHtml } from "../../../../utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const {
		query: { email, subscribe, token },
		method,
	} = req;
	const emailAddress = Array.isArray(email) ? email[0] : email;
	const preference = Array.isArray(subscribe) ? subscribe[0] : subscribe;
	const suppliedToken = Array.isArray(token) ? token[0] : token;
	const secret = process.env.EMAIL_PREFERENCE_SECRET || process.env.GMAIL_PASS;
	if (!emailAddress || !secret || !suppliedToken) {
		return res.status(400).send(getHtml("Invalid link", "<p>This preference link is invalid.</p>"));
	}
	const expectedToken = crypto
		.createHmac("sha256", secret)
		.update(emailAddress)
		.digest("hex");
	if (
		suppliedToken.length !== expectedToken.length ||
		!crypto.timingSafeEqual(Buffer.from(suppliedToken), Buffer.from(expectedToken))
	) {
		return res.status(403).send(getHtml("Invalid link", "<p>This preference link is invalid.</p>"));
	}
	if (preference !== "true" && preference !== "false") {
		return res.status(400).send(getHtml("Invalid link", "<p>This preference link is invalid.</p>"));
	}

	const errorPage = {
		title: "error",
		html: `
				<h1>Something went wrong...</h1>

				<p>Please try again or contact the <a href="mailto:tino@tinomuzambi.com">developer</a></p>
				`,
	};

	switch (method) {
		case "GET":
			try {
				const user: mongoose.UpdateQuery<any> = await User.updateOne(
					{ email: emailAddress },
					{ emails: preference === "true" }
				);

				if (!user) {
					return res.status(400).send(getHtml(errorPage.title, errorPage.html));
				}
				if (preference === "false")
					res.status(200).send(
						getHtml(
							"Unsubscribe",
							`
								<h1>We're sorry to see you go.</h1>
								<p>You will no longer receive email notifications from <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a>.</p>
								<h2>Made a mistake?</h2>

								<a href="https://recomments.tinomuzambi.com/api/users/emails?subscribe=true&email=${encodeURIComponent(
									emailAddress
								)}&token=${suppliedToken}">Click here to resubscribe</a>
							`
						)
					);
				else
					res.status(200).send(
						getHtml(
							"Resubscribe",
							`
								<h1>You are now resubscribed!</h1>
								<p>You will receive email notifications from <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a>.</p>
							`
						)
					);
			} catch (error) {
				console.error("Email preference update failed", error);
				return res.status(400).send(getHtml(errorPage.title, errorPage.html));
			}
			break;
		default:
			return res.status(405).send(getHtml(errorPage.title, errorPage.html));
	}
};
