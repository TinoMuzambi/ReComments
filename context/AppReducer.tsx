const Reducer = (state: any, action: any) => {
	switch (action.type) {
		case "UPDATE_SIGNED_IN":
			return {
				...state,
				signedIn: action.payload,
			};
		default:
			return state;
	}
};

export default Reducer;
