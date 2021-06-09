export const getSignedIn: Function = (): boolean => {
	return gapi.auth2.getAuthInstance().isSignedIn.get();
};

export const updateSignInStatus = (
	isSignedIn: boolean,
	cb: Function,
	cancelLoading?: Function
) => {
	if (isSignedIn) makeApiCall(cb);
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

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall(cb: Function) {
	gapi.client.people.people
		.get({
			resourceName: "people/me",
			personFields: "names,emailAddresses,photos",
		})
		.then(function (resp: gapi.client.Response<gapi.client.people.Person>) {
			// console.log(resp.result);
			cb(resp.result);
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
// Make sure the client is loaded and sign-in is complete before calling this method.
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

	try {
		const response = await gapi.client.youtube.videos.list({
			part: ["snippet,statistics,player,status"],
			id: [path],
		});
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
