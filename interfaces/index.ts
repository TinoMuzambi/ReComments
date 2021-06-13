import { Dispatch, FormEventHandler, SetStateAction } from "react";

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

export interface FormProps {
	handleSubmit: FormEventHandler<HTMLFormElement>;
	searchTerm: string;
	setSearchTerm: Function;
}

export interface CommentModel {
	_id: string;
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
	_id?: string;
	userId: string;
	email: string;
	shortName: string;
	name: string;
	photoUrl?: string;
	createdAt: Date;
	updatedAt: Date;
	upvotedIds?: string[];
	downvotedIds?: string[];
}

export type User = gapi.client.people.Person | null;

export interface ContextProps {
	signedIn: boolean;
	user: User;
	setSignedIn?: Function;
	setUser?: Function;
	dbUser: UserModel | null;
	setDbUser?: Function;
}

export type Actions = {
	type: "UPDATE_SIGNED_IN" | "SET_USER" | "SET_DB_USER";
	auth: boolean;
	user: User;
	dbUser: UserModel | null;
};

export type State = { signedIn: boolean; user: User; dbUser: UserModel | null };
