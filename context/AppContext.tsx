import { createContext, useReducer } from "react";

const initialState = {
	signedIn: false,
};

export const AppContext = createContext(initialState);

export const AppProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	const setSignedIn = (value) => {
		dispatch({
			type: "UPDATE_SIGNED_IN",
			payload: value,
		});
	};
};

return (
	<AppContext.Provider value={{ signedIn: state.signedIn, setSignedIn }}>
		{children}
	</AppContext.Provider>
);
