import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html lang="en" prefix="og: http://ogp.me/ns#">
				<Head>
					<script src="https://apis.google.com/js/api.js"></script>

					<script
						async
						src="https://www.googletagmanager.com/gtag/js?id=UA-141921777-1"
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: `window.dataLayer = window.dataLayer || [];

                            function gtag() {
                                dataLayer.push(arguments);
                            }
                
                            gtag("js", new Date());
                
                            gtag("config", "UA-141921777-1");`,
						}}
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
