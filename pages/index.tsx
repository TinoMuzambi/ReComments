import { useContext } from "react";
import Link from "next/link";

import { AppContext } from "../context/AppContext";

const Home = (): JSX.Element => {
	const { signedIn } = useContext(AppContext);

	return (
		<>
			<main className="main index">
				<div className="topbar">
					<h1 className="title">
						Welcome to <span className="accent">ReComments</span>
					</h1>
					{!signedIn && (
						<Link href="/signin">
							<a className="action">Sign In</a>
						</Link>
					)}
				</div>
				<section className="about">
					<h2 className="subtitle">About</h2>
					<p className="text">
						<span className="accent">ReComments</span> is a site designed to
						bring back the ability to comment on YouTube videos where the
						uploader has decided to turn them off. You simply paste the video
						url on the search page then the video will be fetched. Once you
						navigate to the video, you'll be able to play the video on{" "}
						<span className="accent">ReComments</span> as well as see the stats
						for the video (such as number of likes/dislikes/views). But more
						importantly, you'll now be able to comment on the video (keep it
						friendly though). <span className="accent">ReComments </span>
						will also notify you via email (promise no spam) when people reply
						to your comments.
					</p>
				</section>
				<section className="method">
					<h2 className="subtitle">How it works</h2>
					<h5 className="tag">The technical stuff</h5>
					<p className="text">
						<span className="accent">ReComments</span> uses the Google People
						API to facilitate signing into the site as well as storing only the
						necessary user data. Once you're signed in,{" "}
						<span className="accent">ReComments</span> uses the Google YouTube
						API to fetch video data.
					</p>
					<p className="text">
						<span className="accent">ReComments</span> is implemented using
						Next.js with TypeScript for the front-end. Styling is done through
						Sass. The back-end is comprised of Next.js serverless functions. The
						back-end handles storing user/comment data in a MongoDB database as
						well as handling sending emails via Nodemailer.
					</p>
				</section>
			</main>
			<footer className="privacy">
				<h2 className="subtitle">The Boring Stuff</h2>
				<div className="links">
					<Link href="/privacy">
						<a className="action">Privacy Policy</a>
					</Link>
					<Link href="/terms">
						<a className="action">Terms &amp; Conditions</a>
					</Link>
				</div>
			</footer>
		</>
	);
};

export default Home;
