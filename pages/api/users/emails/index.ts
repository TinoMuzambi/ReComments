import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

import User from "../../../../models/User";
import dbConnect from "../../../../utils/dbConnect";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	dbConnect();
	const {
		query: { email, subscribe },
		method,
	} = req;

	const getHtml: Function = (title: string, html: string): string => {
		return `
			<head>
				<title>${title} | ReComments</title>
			</head>
			<header>
				<img src="https://a.storyblok.com/f/114267/1080x1080/b66aa450e5/recomments.png" alt="logo"/>
			</header>
			<main>
				${html}

				<div class="bar" />
			</main>
			<style>
				@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;700;900&display=swap");
				* {
					font-family: "Poppins", sans-serif;
				}

				header img {
					height: 100px;
				}

				body {
					padding: 2rem;
				}

				a {
					color: rgb(61, 166, 255);
				}

				.bar {
					margin: 1rem 0;
					background: #ffa500;
					height: 2rem;
					width: 100%
				}
			</style>
		`;
	};

	const error = {
		title: "error",
		html: `
				<h1>Something went wrong...</h1>

				<p>Please try again or contact the <a href="mailto:tino@tinomuzambi.com">developer</	a></p>
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
