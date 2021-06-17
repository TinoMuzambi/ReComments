export const getSignedIn: Function = (): boolean => {
	return gapi.auth2.getAuthInstance().isSignedIn.get();
};

export const updateSignInStatus: Function = (
	isSignedIn: boolean,
	callback: Function,
	cancelLoading?: Function
) => {
	if (isSignedIn) makeApiCall(callback);
	else if (cancelLoading) cancelLoading();
};

export const handleAuthClick: Function = () => {
	return gapi.auth2
		.getAuthInstance()
		.signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" });
};

export const handleSignoutClick: Function = () => {
	gapi.auth2.getAuthInstance().signOut();
};

const makeApiCall: Function = async (callback: Function) => {
	const resp = await gapi.client.people.people.get({
		resourceName: "people/me",
		personFields: "names,emailAddresses,photos",
	});
	callback(resp.result);
};

export const loadClient: Function = () => {
	gapi.client.setApiKey(process.env.GAPP_API_KEY || "");
	return gapi.client
		.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest", "")
		.then(
			function () {},
			function () {}
		);
};

export const execute: Function = async (
	popular: boolean,
	query: string,
	fullPath: boolean,
	setResults?: Function,
	setFetching?: Function,
	setNoResults?: Function
) => {
	let path: string = "";
	let start = query.indexOf("v=") + 2;
	if (start === 1) {
		start = query.length - 11;
	}
	path = fullPath ? query.substring(start, start + 11) : query;

	try {
		let response: gapi.client.Response<gapi.client.youtube.VideoListResponse>;

		if (popular) {
			const res = await fetch("/api/home");
			const data = await res.json();

			const resp = data.data[0].videos;
			response = await gapi.client.youtube.videos.list({
				part: ["snippet,statistics,player,status"],
				id: [resp.join(",")],
			});
		} else {
			response = await gapi.client.youtube.videos.list({
				part: ["snippet,statistics,player,status"],
				id: path,
			});
		}

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
};
