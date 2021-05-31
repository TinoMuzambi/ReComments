import Wrapper from "../components/Wrapper";

function MyApp({ Component, pageProps }) {
	return (
		<Wrapper>
			<Component {...pageProps} />
		</Wrapper>
	);
}

export default MyApp;
