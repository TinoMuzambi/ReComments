import { shuffle } from ".";

export const loadClient: Function = (): Promise<void> => {
	// Load gapi YouTube client and set api key.
	gapi.client.setApiKey(process.env.GAPP_API_KEY || "");
	return gapi.client
		.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest", "")
		.then(
			function () {},
			function () {}
		);
};

export const getSignedIn: Function = (): boolean => {
	// Get current signed in status.
	return gapi.auth2.getAuthInstance().isSignedIn.get();
};

export const updateSignInStatus: Function = (
	isSignedIn: boolean,
	callback: Function,
	cancelLoading?: Function
) => {
	// Call People API to get user data.
	if (isSignedIn) makeApiCall(callback);
	else if (cancelLoading) cancelLoading();
};

export const handleAuthClick: Function = () => {
	// Sign in with YouTube readonly scope.
	return gapi.auth2
		.getAuthInstance()
		.signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" });
};

export const handleSignoutClick: Function = () => {
	// Sign out.
	gapi.auth2.getAuthInstance().signOut();
};

const makeApiCall: Function = async (callback: Function) => {
	// Call People API to get user data.
	const res = await gapi.client.people.people.get({
		resourceName: "people/me",
		personFields: "names,emailAddresses,photos",
	});
	callback(res.result);
};

export const execute: Function = async (
	homeVideos: boolean,
	query: string,
	setResults?: Function,
	setFetching?: Function,
	setNoResults?: Function
) => {
	// Call YouTube API to get video data.
	try {
		let response: gapi.client.Response<gapi.client.youtube.VideoListResponse>;
		const part = ["snippet,statistics,player,status"];

		if (homeVideos) {
			// Get videos from db to display on home page.
			const res = await fetch("/api/home");
			const data = await res.json();

			const ids: string[] = data.data.videos;

			response = await gapi.client.youtube.videos.list({
				part,
				id: [ids.join(",")],
			});
		} else {
			// Get video from search.
			let start = query.indexOf("v=") + 2;
			if (start === 1) {
				start = query.length - 11;
			}
			const id = query.substring(start, start + 11);
			response = await gapi.client.youtube.videos.list({
				part,
				id,
			});
		}

		if (setResults) setResults(shuffle(response.result.items));

		if (setFetching) setFetching(false);

		if (response.result.pageInfo) {
			if (response.result.pageInfo.totalResults === 0) {
				if (setNoResults) setNoResults(true);
			} else {
				if (setNoResults) setNoResults(false);
			}
		}
	} catch (err) {
		if (setResults) setResults(err);
	}
};
