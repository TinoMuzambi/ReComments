import { State, Actions } from "../interfaces";

const Reducer = (state: State, action: Actions) => {
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
		default:
			return state;
	}
};

export default Reducer;
