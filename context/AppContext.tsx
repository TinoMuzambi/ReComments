import { createContext, useReducer } from "react";

import AppReducer from "./AppReducer";
import { ContextProps } from "../interfaces";

const initialState: ContextProps = {
	signedIn: false,
	user: null,
};

export const AppContext = createContext<ContextProps>(initialState);

export const AppProvider = ({ children }: any) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	const setSignedIn = (value: boolean) => {
		dispatch({
			type: "UPDATE_SIGNED_IN",
			auth: value,
			user: state.user,
		});
	};

	const setUser = (value: {} | null) => {
		dispatch({
			type: "SET_USER",
			auth: state.signedIn,
			user: value,
		});
	};

	return (
		<AppContext.Provider
			value={{
				signedIn: state.signedIn,
				user: state.user,
				setSignedIn,
				setUser,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
