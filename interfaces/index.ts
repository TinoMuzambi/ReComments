import { FormEventHandler } from "react";

export type WrapperProps = {
	children: any;
};

export type MetaProps = {
	title: string;
	description: string;
	keywords: string;
	url: string;
	image: string;
};

export type ContextProps = {
	signedIn: boolean;
	setSignedIn?: Function;
};

export type VideoProps = {
	title: string;
	id: string;
	date: string;
	description: string;
	channel: string;
	thumbnail: string;
	embeddable: boolean;
	views: number;
	likes: number;
	dislikes: number;
	html: string;
};

export type FormProps = {
	handleSubmit: FormEventHandler<HTMLFormElement>;
	url: string;
	setUrl: Function;
};

export interface IResource extends Document {
	title: string;
	url: string;
	date: Date;
	description: String;
	datePublished: String | Date;
}
