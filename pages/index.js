import { useEffect } from "react";

export default function Home() {
	function authenticate() {
		return gapi.auth2
			.getAuthInstance()
			.signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
			.then(
				function () {
					console.log("Sign-in successful");
				},
				function (err) {
					console.error("Error signing in", err);
				}
			);
	}
	function loadClient() {
		gapi.client.setApiKey(process.env.GAPP_CLIENT_SECRET);
		return gapi.client
			.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
			.then(
				function () {
					console.log("GAPI client loaded for API");
				},
				function (err) {
					console.error("Error loading GAPI client for API", err);
				}
			);
	}
	// Make sure the client is loaded and sign-in is complete before calling this method.
	function execute() {
		return gapi.client.youtube.videos
			.list({
				part: ["snippet,statistics,player,status"],
				id: ["hRI0ymx_6aw"],
			})
			.then(
				function (response) {
					// Handle the results here (response.result has the parsed body).
					console.log("Response", response);
				},
				function (err) {
					console.error("Execute error", err);
				}
			);
	}
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
