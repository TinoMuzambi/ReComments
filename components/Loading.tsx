const Loading: React.FC = () => {
	return (
		<main className="main">
			<div className="error-holder">
				<img
					src="https://a.storyblok.com/f/114267/1222x923/8898eb61f4/error.png"
					alt="error"
					className="error-image"
				/>
				<h1 className="error">Loading...</h1>
			</div>
		</main>
	);
};

export default Loading;
