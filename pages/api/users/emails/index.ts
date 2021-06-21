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
				res.status(200).send(`
				<header>
					<img src="https://a.storyblok.com/f/114267/1080x1080/b66aa450e5/recomments.png" alt="logo"/>
				</header>
				<main>
					<h1>We're sorry to see you go.</h1>
					<p>You will no longer receive email notifications from <a href="https://recomments.tinomuzambi.com" target="_blank">ReComments</a>.</p>
					<h1>Made a mistake?</h1>

					<a href="http://localhost:3000/api/emails&subscribe=true&email=${email}">Click here to resubscribe</a>
					<a></a>
				</main>
				<style>
					@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;700;900&display=swap");
					* {
						font-family: "Poppins", sans-serif;
					}
	
					header img {
						height: 100px;
					}
	
					b {
						color:  #ffa500;
					}
	
					blockquote {
						background: #f9f9f9;
						border-left: 10px solid #ccc;
						margin: 1.5em 10px;
						padding: 0.5em 10px;
						white-space: pre-wrap;
					}
	
					blockquote:before {
						color: #ccc;
						content: open-quote;
						font-size: 4em;
						line-height: .1em;
						margin-right: .25em;
						vertical-align: -.4em;
					}
	
					.bar {
						margin: 0 0.5rem;
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
