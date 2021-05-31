import { useEffect } from "react";

import { authenticate, loadClient, execute } from "../utils/gapi";

export default function Home() {
	useEffect(() => {
		gapi.load("client:auth2", function () {
			gapi.auth2.init({ client_id: process.env.GAPP_CLIENT_ID });
		});
	}, []);

	return (
		<>
			<button onClick={() => authenticate().then(loadClient)}>Load</button>
			<button onClick={() => execute()}>execute</button>
		</>
	);
}
