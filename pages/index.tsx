import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";

import { authenticate, loadClient, execute } from "../utils/gapi";

export default function Home() {
	const [videoID, setVideoID] = useState({
		videoId: "https://www.youtube.com/watch?v=R3tbVHlsKhs",
	});
	const router = useRouter();

	useEffect(() => {
		gapi.load("client:auth2", function () {
			gapi.auth2.init({ client_id: process.env.GAPP_CLIENT_ID });
		});
	}, []);

	const signIn = () => {
		authenticate(() => router.push("/videos")).then(loadClient());
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
