import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

import User from "../../../../models/User";
import dbConnect from "../../../../utils/dbConnect";
import { getHtml } from "../../../../utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	dbConnect();
	const {
		query: { email, subscribe },
		method,
	} = req;

	const error = {
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
					{ email: email },
					{ emails: subscribe }
				);

				if (!user) {
					return res.status(400).send(getHtml(error.title, error.html));
				}
				if (!JSON.parse(subscribe as string))
					res.status(200).send(
						getHtml(
							"Unsubscribe",
							`
								<h1>We're sorry to see you go.</h1>
								<p>You will no longer receive email notifications from <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a>.</p>
								<h2>Made a mistake?</h2>

								<a href="https://recomments.tinomuzambi.com/api/users/emails?subscribe=true&email=${email}">Click here to resubscribe</a>
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
				return res.status(400).send(getHtml(error.title, error.html));
			}
			break;
		default:
			return res.status(400).send(getHtml(error.title, error.html));
	}
};
