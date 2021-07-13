import { AppStateProps } from "../interfaces";

const Loading: React.FC<AppStateProps> = ({ message }): JSX.Element => {
	return (
		<main className="main">
			<div className="holder">
				<img
					// Error image from Storyblok CMS.
					src="https://a.storyblok.com/f/114267/1222x923/8898eb61f4/error.png"
					alt={message}
				/>
				<h1>{message}</h1>
			</div>
		</main>
	);
};

export default Loading;
