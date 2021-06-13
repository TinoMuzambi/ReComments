import { createContext, useReducer } from "react";

import AppReducer from "./AppReducer";
import { AppProviderProps, ContextProps, UserModel, User } from "../interfaces";

const initialState: ContextProps = {
	signedIn: false,
	user: null,
	dbUser: null,
	results: [],
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
			results: state.results,
		});
	};

	const setUser = (value: User) => {
		dispatch({
			type: "SET_USER",
			auth: state.signedIn,
			user: value,
			dbUser: state.dbUser,
			results: state.results,
		});
	};

	const setDbUser = (value: UserModel | null) => {
		dispatch({
			type: "SET_DB_USER",
			auth: state.signedIn,
			user: state.user,
			dbUser: value,
			results: state.results,
		});
	};

	const setResults = (value: gapi.client.youtube.Video[] | null) => {
		dispatch({
			type: "SET_DB_USER",
			auth: state.signedIn,
			user: state.user,
			dbUser: state.dbUser,
			results: value,
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
				results: state.results,
				setResults,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
