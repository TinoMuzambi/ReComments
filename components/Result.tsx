const Result: React.FC<any> = ({ result }) => {
	return (
		<div className="result">
			<img
				src={result.snippet.thumbnails.high.url}
				alt="title"
				className="thumbnail"
			/>
			<div className="details">
				<h2 className="name">{result.snippet.title}</h2>
				<div className="bottom">
					<h3 className="uploader">{result.snippet.channelTitle}</h3>
					<h5 className="date">
						Uploaded on{" "}
						{new Date(result.snippet.publishedAt).toLocaleDateString()}
					</h5>
				</div>
			</div>
		</div>
	);
};

export default Result;
