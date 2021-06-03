import { createContext, useReducer } from "react";

import AppReducer from "./AppReducer";
import { ContextProps } from "../interfaces";

const initialState = {
	signedIn: false,
};

export const AppContext = createContext<ContextProps>(initialState);

export const AppProvider = ({ children }: any) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	const setSignedIn = (value: boolean) => {
		dispatch({
			type: "UPDATE_SIGNED_IN",
			auth: value,
		});
	};

	return (
		<AppContext.Provider value={{ signedIn: state.signedIn, setSignedIn }}>
			{children}
		</AppContext.Provider>
	);
};
