import { AppProps } from "next/app";

import Wrapper from "../components/Wrapper";
import "../sass/App.scss";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Wrapper>
			<Component {...pageProps} />
		</Wrapper>
	);
}

export default MyApp;
