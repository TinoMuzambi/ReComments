import { useEffect, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import {
	/*authenticate,*/ updateSignInStatus,
	handleAuthClick,
} from "../utils/gapi";

export default function Home() {
	const router = useRouter();
	const { setSignedIn, signedIn } = useContext(AppContext);

	useEffect(() => {
		gapi.load("client:auth2", function () {
			// gapi.auth2.init({ client_id: process.env.GAPP_CLIENT_ID });
			gapi.client
				.init({
					apiKey: process.env.GAPI_API_KEY,
					discoveryDocs: [
						"https://people.googleapis.com/$discovery/rest?version=v1",
					],
					clientId: process.env.GAPP_CLIENT_ID,
					scope: "profile",
				})
				.then(() => {
					gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

					updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
				});
		});
	}, []);

	useEffect(() => {
		if (signedIn) router.push("/search");
	}, [signedIn]);

	// const signIn = () => {
	// 	authenticate();
	// };

	return (
		<main className="main">
			<h1 className="title">ReComments</h1>
			<button className="sign-in" onClick={handleAuthClick}>
				<span>
					<FcGoogle />
				</span>
				&nbsp;Sign In with Google
			</button>
		</main>
	);
}
