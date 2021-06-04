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

export interface ContextProps {
	signedIn: boolean;
	setSignedIn?: Function;
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

export interface Auth {
	signedIn: boolean;
}

export type Actions = {
	type: "UPDATE_SIGNED_IN" | "SET_USER";
	auth: boolean;
	user?: {} | null;
};

export type State = Auth;
