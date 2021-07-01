import { State, Actions } from "../interfaces";

const Reducer = (state: State, action: Actions): State => {
	switch (action.type) {
		case "UPDATE_SIGNED_IN":
			return {
				...state,
				signedIn: action.auth,
			};
		case "SET_USER": {
			return {
				...state,
				user: action.user,
			};
		}
		case "SET_DB_USER": {
			return {
				...state,
				dbUser: action.dbUser,
			};
		}
		case "SET_SEARCH_RESULTS": {
			return {
				...state,
				searchResults: action.searchResults,
			};
		}
		case "SET_VIDEO_COMMENTS": {
			return {
				...state,
				videoComments: action.videoComments,
			};
		}
		default:
			return state;
	}
};

export default Reducer;
