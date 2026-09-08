export const getAuthorizationHeaders = (): Record<string, string> => {
	if (typeof gapi === "undefined") return {};

	const accessToken = gapi.auth2
		.getAuthInstance()
		.currentUser.get()
		.getAuthResponse().access_token;

	return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};
