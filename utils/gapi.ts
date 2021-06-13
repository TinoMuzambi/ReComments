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
	query: string,
	fullPath: boolean,
	setResults?: Function,
	setFetching?: Function,
	setNoResults?: Function
) {
	const isUrl =
		query.indexOf("youtube.com") !== -1 || query.indexOf("youtu.be") !== -1;

	let path: string = "";
	if (isUrl) {
		let start = query.indexOf("v=") + 2;
		if (start === 1) {
			start = query.length - 11;
		}
		path = fullPath ? query.substring(start, start + 11) : query;
	}

	try {
		let videoIds: string[] = [];
		if (!isUrl) {
			const videos = await gapi.client.youtube.search.list({
				part: ["snippet"],
				maxResults: 25,
				q: query,
			});
			videos.result.items?.map((item) =>
				videoIds.push(item.id?.videoId as string)
			);
		}

		const response = await gapi.client.youtube.videos.list({
			part: ["snippet,statistics,player,status"],
			id: isUrl ? path : [videoIds.join(",")],
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
