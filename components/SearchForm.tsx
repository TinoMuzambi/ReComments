import { MdSearch } from "react-icons/md";

import { SearchFormProps } from "../interfaces";

const Form: React.FC<SearchFormProps> = ({
	handleSubmit,
	searchTerm,
	setSearchTerm,
}): JSX.Element => {
	return (
		<form className="form" onSubmit={handleSubmit}>
			<input
				type="url"
				placeholder="Enter YouTube video url..."
				required
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="search"
			/>
			<button type="submit" className="submit">
				<MdSearch className="icon" />
			</button>
		</form>
	);
};

export default Form;
