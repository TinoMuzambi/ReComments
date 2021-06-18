import Document, { Html, Head, Main, NextScript } from "next/document";
import { MouseEventHandler } from "react";

class MyDocument extends Document {
	render() {
		let dark: boolean = false;

		const toggleDarkMode: MouseEventHandler<HTMLButtonElement> = () => {
			dark = !dark;
		};

		return (
			<Html lang="en" prefix="og: http://ogp.me/ns#">
				<Head>
					<script src="https://apis.google.com/js/api.js"></script>
				</Head>
				<body className={`${dark && "dark"}`}>
					<button className="toggle" onClick={toggleDarkMode}>
						Dark
					</button>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
