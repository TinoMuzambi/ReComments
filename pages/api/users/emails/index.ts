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

	switch (method) {
		case "GET":
			try {
				const user: mongoose.UpdateQuery<any> = await User.updateOne(
					{ email: email },
					{ emails: subscribe }
				);

				if (!user) {
					return res
						.status(400)
						.json({ success: false, data: { message: "User not found" } });
				}
				if (!JSON.parse(subscribe as string))
					res.status(200).send(`
				<head>
					<title>Unsubscribe | ReComments</title>
				</head>
				<header>
					<img src="https://a.storyblok.com/f/114267/1080x1080/b66aa450e5/recomments.png" alt="logo"/>
				</header>
				<main>
					<h1>We're sorry to see you go.</h1>
					<p>You will no longer receive email notifications from <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a>.</p>
					<h1>Made a mistake?</h1>

					<a href="https://recomments.tinomuzambi.com/api/users/emails?subscribe=true&email=${email}">Click here to resubscribe</a>
					<div class="bar"/>
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
	
					.bar {
						margin: 1rem 0;
						background: #ffa500;
						height: 2rem;
						width: 100%
					}
				</style>
				`);
				else
					res.status(200).send(`
				<head>
					<title>Resubscribe | ReComments</title>
				</head>
				<header>
					<img src="https://a.storyblok.com/f/114267/1080x1080/b66aa450e5/recomments.png" alt="logo"/>
				</header>
				<main>
					<h1>You are now resubscribed!</h1>
					<p>You will receive email notifications from <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a>.</p>
					<div class="bar"/>
				</main>
				<style>
					@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;700;900&display=swap");
					* {
						font-family: "Poppins", sans-serif;
					}

					body {
						padding: 2rem;
					}
	
					header img {
						height: 100px;
					}
	
					.bar {
						margin: 1rem 0;
						background: #ffa500;
						height: 2rem;
						width: 100%
					}
				</style>
				`);
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
