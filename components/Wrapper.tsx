import Head from "next/head";

import { WrapperProps } from "../interfaces";
import { AppProvider } from "../context/AppContext";

const Wrapper = ({
	children,
	title,
	description,
	keywords,
	url,
	image,
}: WrapperProps) => {
	return (
		<AppProvider>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#000000" />
				<meta name="keywords" content={keywords} />
				<meta name="description" content={description} />

				{/* <!-- Google / Search Engine Tags --> */}
				<meta itemProp="name" content={title} />
				<meta itemProp="description" content={description} />
				<meta itemProp="image" content={image} />

				{/* <!-- Facebook Meta Tags --> */}
				<meta property="og:url" content={url} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={image} />

				{/* <!-- Twitter Meta Tags --> */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={image} />

				<meta charSet="utf-8" />
				<link rel="icon" href="/favicon.ico" />
				<meta name="TinoMuzambi" content="My personal website." />
				<link rel="apple-touch-icon" href="/logo192.png" />
				<link rel="manifest" href="/manifest.json" />
				<title>{title}</title>

				<link rel="preconnect" href="https://api.storyblok.com" />
				<link rel="preconnect" href="https://a.storyblok.com" />
				<link rel="preconnect" href="https://www.google-analytics.com" />
			</Head>
			{children}
		</AppProvider>
	);
};

Wrapper.defaultProps = {
	title: "ReComments",
	keywords: "youtube, comments, google, entertainment",
	description:
		"Ever wanted to comment on a video but the uploader has comments turned off? ReComments is your go to for commenting on YouTube videos with comments turned off.",
	image: "https://a.storyblok.com/f/105639/512x512/03489159d5/logo512.png",
	url: "https://re-comments.vercel.app/",
};

export default Wrapper;
