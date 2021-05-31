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
