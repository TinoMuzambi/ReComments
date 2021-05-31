import { useEffect, useState } from "react";

import { authenticate, loadClient, execute } from "../utils/gapi";

export default function Home() {
	const [videoID, setVideoID] = useState({
		videoId: "https://www.youtube.com/watch?v=R3tbVHlsKhs",
	});
	useEffect(() => {
		gapi.load("client:auth2", function () {
			gapi.auth2.init({ client_id: process.env.GAPP_CLIENT_ID });
		});
	}, []);

	return (
		<>
			<button onClick={() => authenticate().then(loadClient)}>Load</button>
			<button onClick={() => execute(videoID)}>execute</button>
		</>
	);
}
