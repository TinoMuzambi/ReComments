export const getSignedIn: Function = (): boolean => {
	return gapi.auth2.getAuthInstance().isSignedIn.get();
};

export const updateSignInStatus = (
	isSignedIn: boolean,
	callback: Function,
	cancelLoading?: Function
) => {
	if (isSignedIn) makeApiCall(callback);
	else if (cancelLoading) cancelLoading();
};

export function handleAuthClick() {
	gapi.auth2
		.getAuthInstance()
		.signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" });
}

export function handleSignoutClick() {
	gapi.auth2.getAuthInstance().signOut();
}

function makeApiCall(callback: Function) {
	gapi.client.people.people
		.get({
			resourceName: "people/me",
			personFields: "names,emailAddresses,photos",
		})
		.then(function (resp: gapi.client.Response<gapi.client.people.Person>) {
			callback(resp.result);
		});
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

export async function execute(
	videoId: string,
	fullPath: boolean,
	setResults?: Function,
	setFetching?: Function,
	setNoResults?: Function
) {
	let start = videoId.indexOf("v=") + 2;
	if (start === 1) {
		start = videoId.length - 11;
	}
	const path = fullPath ? videoId.substring(start, start + 11) : videoId;

	let ids: string[] = [];
	try {
		await gapi.client.youtube.search
			.list({
				part: ["snippet"],
				maxResults: 25,
				q: "surfing",
			})
			.then(
				function (response) {
					// Handle the results here (response.result has the parsed body).
					response.result.items?.map((item) =>
						ids.push(item.id?.videoId as string)
					);
					console.log(ids.join(","));
				},
				function (err) {
					console.error("Execute error", err);
				}
			);

		const response = await gapi.client.youtube.videos.list({
			part: ["snippet,statistics,player,status"],
			id: [ids.join(",")],
		});
		console.log(response);
		if (setResults) setResults(response.result.items);
		if (setFetching) setFetching(false);
		if (response.result.pageInfo) {
			if (response.result.pageInfo.totalResults === 0) {
				if (setNoResults) setNoResults(true);
			} else {
				if (setNoResults) setNoResults(false);
			}
		}
	} catch (err) {
		console.error(err);
		if (setResults) setResults(err);
	}
}
