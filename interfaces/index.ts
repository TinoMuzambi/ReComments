import { FormEventHandler } from "react";

export interface WrapperProps {
	children: any;
}

export interface MetaProps {
	title?: string;
	description?: string;
	keywords?: string;
	url?: string;
	image?: string;
}

export interface FormProps {
	handleSubmit: FormEventHandler<HTMLFormElement>;
	url: string;
	setUrl: Function;
}

export interface CommentModel {
	videoId: string;
	authorId: string;
	createdAt?: Date;
	updatedAt?: Date;
	name: string;
	email: string;
	image: string;
	comment: string;
	upvotes?: number;
	downvotes?: number;
	mention?: string | null;
	replies?: CommentModel[];
}

export interface UserModel {
	userId: string;
	email: string;
	shortName: string;
	name: string;
	photoUrl: string;
	createdAt: Date;
	updatedAt: Date;
}

type User = gapi.client.people.Person | null;

export interface ContextProps {
	signedIn: boolean;
	user: User;
	setSignedIn?: Function;
	setUser?: Function;
}

export type Actions = {
	type: "UPDATE_SIGNED_IN" | "SET_USER";
	auth: boolean;
	user: User;
};

export type State = { signedIn: boolean; user: User };
