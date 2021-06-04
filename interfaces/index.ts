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

export interface VideoProps {
	id: string;
	snippet: {
		title: string;
		publishedAt: string;
		description: string;
		thumbnails: {
			maxres: {
				url: string;
			};
		};
		channelTitle: string;
	};
	status: { embeddable: boolean };
	statistics: { viewCount: number; likeCount: number; dislikeCount: number };
	player: { embedHtml: string };
}

export interface FormProps {
	handleSubmit: FormEventHandler<HTMLFormElement>;
	url: string;
	setUrl: Function;
}

export interface IResource extends Document {
	title: string;
	url: string;
	date: Date;
	description: String;
	datePublished: String | Date;
}

type User = {
	emailAddresses?: [{}];
	etag?: string;
	names?: [{ givenName: string }];
	photos?: [{ url: string }];
} | null;

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
