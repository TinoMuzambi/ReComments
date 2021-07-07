import {
	Dispatch,
	FormEventHandler,
	MouseEventHandler,
	SetStateAction,
} from "react";

export interface WrapperProps {
	children: JSX.Element;
}

export interface MetaProps {
	title?: string;
	description?: string;
	keywords?: string;
	url?: string;
	image?: string;
}

export interface AppProviderProps {
	children: JSX.Element[];
}

export interface PlayerProps {
	result: gapi.client.youtube.Video;
}

export interface ResultProps {
	result: gapi.client.youtube.Video;
	blockFormat: boolean;
}

export interface StatsProps {
	result: gapi.client.youtube.Video;
}

export interface AppStateProps {
	message: string;
}

export interface VideoProps {
	dbComments: CommentModel[];
}

export interface CommentsProps {
	comments: CommentModel[];
}

export interface CommentProps {
	comment: CommentModel;
	isViewMoreExpanded: boolean;
	setIsViewMoreExpanded: Dispatch<SetStateAction<boolean>>;
}

export interface CommentContentProps {
	currComment: CommentModel;
	originalComment?: CommentModel;
	isSecondLevelComment: boolean;
	setIsViewMoreExpanded: Dispatch<SetStateAction<boolean>>;
}

export interface CommentFormProps {
	isSecondLevelComment: boolean;
	currComment?: CommentModel;
	originalComment?: CommentModel;
	setIsViewMoreExpanded?: Dispatch<SetStateAction<boolean>>;
	setCommentFormToEditVisible?: Dispatch<SetStateAction<boolean>>;
	setCommentFormToReplyVisible?: Dispatch<SetStateAction<boolean>>;
	commentFormToEditVisible?: boolean;
	commentFormToReplyVisible?: boolean;
}

export interface SearchFormProps {
	handleSubmit: FormEventHandler<HTMLFormElement>;
	searchTerm: string;
	setSearchTerm: Function;
}

export interface NoticeProps {
	visible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
	title: string;
	subtitle: string;
	noButtons: 1 | 2;
	firstButtonText: string;
	secondButtonText?: string;
	confirmCallback: Function;
	cancelCallback?: Function;
}

export interface HistoryResultProps {
	item: HistoryItem;
	clearVideo: MouseEventHandler<HTMLButtonElement> | any;
}

export interface WatchHistoryProps {
	hideNoticeWrapper: Function;
	setDeleteOrSubmitOrClear: Dispatch<
		SetStateAction<"delete" | "submit" | "clear">
	>;
	setSpinnerVisible: Dispatch<SetStateAction<boolean>>;
	setNoticeTitle: Dispatch<SetStateAction<string>>;
	setNoticeSubtitle: Dispatch<SetStateAction<string>>;
	setNoticeNoButtons: Dispatch<SetStateAction<1 | 2>>;
	setNoticeFirstButtonText: Dispatch<SetStateAction<string>>;
	setNoticeSecondButtonText: Dispatch<SetStateAction<string>>;
}

export interface CommentModel {
	id?: string;
	videoId: string;
	authorId: string;
	createdAt?: Date;
	updatedAt?: Date;
	name: string;
	email: string;
	image: string;
	comment: string;
	upvotes: number;
	downvotes: number;
	mention?: string | null;
	replies?: CommentModel[];
	edited: boolean;
}

export interface UserModel {
	userId: string;
	email: string;
	shortName: string;
	name: string;
	photoUrl?: string;
	createdAt: Date;
	updatedAt: Date;
	upvotedIds?: string[];
	downvotedIds?: string[];
	emails: boolean;
	darkMode: boolean;
	watchhistory: HistoryItem[];
}

export interface HistoryItem {
	id: string;
	title: string;
	thumbnail: string;
	uploader: string;
	date: Date;
}

export interface HomeModel {
	videos: string[];
}

export type User = gapi.client.people.Person | null;

export interface ContextProps {
	signedIn: boolean;
	user: User;
	setSignedIn?: Function;
	setUser?: Function;
	dbUser: UserModel | null;
	setDbUser?: Function;
	searchResults: gapi.client.youtube.Video[] | null;
	setSearchResults?: Function;
	videoComments: CommentModel[] | null;
	setVideoComments?: Function;
}

export type Actions = {
	type:
		| "UPDATE_SIGNED_IN"
		| "SET_USER"
		| "SET_DB_USER"
		| "SET_SEARCH_RESULTS"
		| "SET_VIDEO_COMMENTS";
	auth: boolean;
	user: User;
	dbUser: UserModel | null;
	searchResults: gapi.client.youtube.Video[] | null;
	videoComments: CommentModel[] | null;
};

export type State = {
	signedIn: boolean;
	user: User;
	dbUser: UserModel | null;
	searchResults: gapi.client.youtube.Video[] | null;
	videoComments: CommentModel[] | null;
};
