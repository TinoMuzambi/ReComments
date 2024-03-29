import { createContext, useReducer } from "react";

import AppReducer from "./AppReducer";
import {
	AppProviderProps,
	ContextProps,
	UserModel,
	User,
	CommentModel,
} from "../interfaces";

const initialState: ContextProps = {
	signedIn: false,
	user: null,
	dbUser: null,
	searchResults: null,
	videoComments: null,
};

export const AppContext = createContext<ContextProps>(initialState);

export const AppProvider = ({ children }: AppProviderProps): JSX.Element => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	const setSignedIn: Function = (value: boolean) => {
		dispatch({
			type: "UPDATE_SIGNED_IN",
			auth: value,
			user: state.user,
			dbUser: state.dbUser,
			searchResults: state.searchResults,
			videoComments: state.videoComments,
		});
	};

	const setUser: Function = (value: User) => {
		dispatch({
			type: "SET_USER",
			auth: state.signedIn,
			user: value,
			dbUser: state.dbUser,
			searchResults: state.searchResults,
			videoComments: state.videoComments,
		});
	};

	const setDbUser: Function = (value: UserModel | null) => {
		dispatch({
			type: "SET_DB_USER",
			auth: state.signedIn,
			user: state.user,
			dbUser: value,
			searchResults: state.searchResults,
			videoComments: state.videoComments,
		});
	};

	const setSearchResults: Function = (
		value: gapi.client.youtube.Video[] | null
	) => {
		dispatch({
			type: "SET_SEARCH_RESULTS",
			auth: state.signedIn,
			user: state.user,
			dbUser: state.dbUser,
			searchResults: value,
			videoComments: state.videoComments,
		});
	};

	const setVideoComments: Function = (value: CommentModel[] | null) => {
		dispatch({
			type: "SET_VIDEO_COMMENTS",
			auth: state.signedIn,
			user: state.user,
			dbUser: state.dbUser,
			searchResults: state.searchResults,
			videoComments: value,
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
				setSearchResults,
				videoComments: state.videoComments,
				setVideoComments,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
