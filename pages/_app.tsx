import { AppProps } from "next/app";

import Wrapper from "../components/Wrapper";
import "../sass/App.scss";

const MyApp: Function = ({ Component, pageProps }: AppProps) => {
	return (
		<Wrapper>
			<Component {...pageProps} />
		</Wrapper>
	);
};

export default MyApp;
