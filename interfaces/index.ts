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
