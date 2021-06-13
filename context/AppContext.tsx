import { createContext, useReducer } from "react";

import AppReducer from "./AppReducer";
import { AppProviderProps, ContextProps, UserModel, User } from "../interfaces";

const initialState: ContextProps = {
	signedIn: false,
	user: null,
	dbUser: null,
	searchResults: null,
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
			searchResults: state.searchResults,
		});
	};

	const setUser = (value: User) => {
		dispatch({
			type: "SET_USER",
			auth: state.signedIn,
			user: value,
			dbUser: state.dbUser,
			searchResults: state.searchResults,
		});
	};

	const setDbUser = (value: UserModel | null) => {
		dispatch({
			type: "SET_DB_USER",
			auth: state.signedIn,
			user: state.user,
			dbUser: value,
			searchResults: state.searchResults,
		});
	};

	const setResults = (value: gapi.client.youtube.Video[] | null) => {
		dispatch({
			type: "SET_SEARCH_RESULTS",
			auth: state.signedIn,
			user: state.user,
			dbUser: state.dbUser,
			searchResults: value,
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
				searchResults: state.searchResults,
				setSearchResults: setResults,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
