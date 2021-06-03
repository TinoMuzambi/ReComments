import { FormProps } from "../interfaces";

const Form: React.FC<FormProps> = ({ handleSubmit, url, setUrl }) => {
	return (
		<form className="form" onSubmit={handleSubmit}>
			<input
				type="url"
				placeholder="Enter YouTube video url"
				required
				value={url}
				onChange={(e) => setUrl(e.target.value)}
				className="url"
			/>
			<button type="submit" className="submit">
				Search
			</button>
		</form>
	);
};

export default Form;
