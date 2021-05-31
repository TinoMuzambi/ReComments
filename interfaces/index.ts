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
	html: string | string[] | undefined;
};
