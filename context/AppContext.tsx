import { createContext, useReducer } from "react";

import AppReducer from "./AppReducer";
import { AppProviderProps, ContextProps, UserModel } from "../interfaces";

const initialState: ContextProps = {
	signedIn: false,
	user: null,
	dbUser: null,
};

export const AppContext = createContext<ContextProps>(initialState);

export const AppProvider = ({ children }: AppProviderProps) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	const setSignedIn = (value: boolean) => {
		dispatch({
			type: "UPDATE_SIGNED_IN",
			auth: value,
			user: state.user,
			dbUser: state.dbUser,
		});
	};

	const setUser = (value: {} | null) => {
		dispatch({
			type: "SET_USER",
			auth: state.signedIn,
			user: value,
			dbUser: state.dbUser,
		});
	};

	const setDbUser = (value: UserModel | null) => {
		dispatch({
			type: "SET_DB_USER",
			auth: state.signedIn,
			user: state.user,
			dbUser: value,
		});
	};

	return (
		<AppContext.Provider
			value={{
				signedIn: state.signedIn,
				user: state.user,
				setSignedIn,
				setUser,
				dbUser: state.dbUser,
				setDbUser,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
