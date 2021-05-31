import { useEffect, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { authenticate, loadClient } from "../utils/gapi";

export default function Home() {
	const router = useRouter();
	const { setSignedIn } = useContext(AppContext);

	useEffect(() => {
		gapi.load("client:auth2", function () {
			gapi.auth2.init({ client_id: process.env.GAPP_CLIENT_ID });
		});
	}, []);

	const signIn = () => {
		authenticate(() => {
			if (setSignedIn) setSignedIn(true);
			router.push("/videos");
		}).then(loadClient());
	};

	return (
		<main>
			<h1 className="title">ReComments</h1>
			<button className="sign-in" onClick={signIn}>
				<span>
					<FcGoogle />
				</span>
				&nbsp;Sign In with Google
			</button>
		</main>
	);
}
