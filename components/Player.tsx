import parse from "html-react-parser";

const Player: React.FC<gapi.client.youtube.Video | any> = ({ result }) => {
	return (
		<>
			{result.status.embeddable ? (
				<div className="player">{parse(result.player.embedHtml as string)}</div>
			) : result.snippet.thumbnails && result.snippet.thumbnails.maxres ? (
				<div className="player">
					<img
						src={result.snippet.thumbnails.maxres.url}
						alt={result.snippet.title}
						className="thumbnail"
					/>
				</div>
			) : (
				<img
					src="https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
					alt={result.snippet.title}
					className="thumbnail"
				/>
			)}
		</>
	);
};

export default Player;
