import { State, Actions } from "../interfaces";

const Reducer = (state: State, action: Actions) => {
	switch (action.type) {
		case "UPDATE_SIGNED_IN":
			return {
				...state,
				signedIn: action.auth,
			};
		default:
			return state;
	}
};

export default Reducer;
