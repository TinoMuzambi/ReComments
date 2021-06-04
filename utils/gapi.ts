export function authenticate(callback: Function) {
	return gapi.auth2
		.getAuthInstance()
		.signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
		.then(
			function () {
				callback();
			},
			function () {}
		);
}
export function loadClient() {
	gapi.client.setApiKey(process.env.GAPP_API_KEY || "");
	return gapi.client
		.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest", "")
		.then(
			function () {},
			function () {}
		);
}
// Make sure the client is loaded and sign-in is complete before calling this method.
export function execute(
	videoId: string,
	fullPath: boolean,
	setResults?: Function,
	setFetching?: Function,
	setNoResults?: Function
) {
	const start = videoId.indexOf("v=") + 2;
	return gapi.client.youtube.videos
		.list({
			part: ["snippet,statistics,player,status"],
			id: [fullPath ? videoId.substring(start, start + 11) : videoId],
		})
		.then(
			function (response: any) {
				if (setResults) setResults(response.result.items);
				if (setFetching) setFetching(false);
				if (response.result.pageInfo.totalResults === 0) {
					if (setNoResults) setNoResults(true);
				} else {
					if (setNoResults) setNoResults(false);
				}
			},
			function (err: string) {
				if (setResults) setResults(err);
			}
		);
}
