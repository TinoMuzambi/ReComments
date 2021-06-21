import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { to, fromName, commentText, url } = req.body;

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
				<div class="bar"/>
				<div class="unsub">
					<a href="https://localhost:3000/api/emails&subscribe=false&email=${to}">Unsubscribe from these emails</a>
					<a></a>
				</div>
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
			`,
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
