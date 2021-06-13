import { MdClear, MdSearch } from "react-icons/md";

import { FormProps } from "../interfaces";

const Form: React.FC<FormProps> = ({
	handleSubmit,
	searchTerm,
	setSearchTerm,
}) => {
	return (
		<form className="form" onSubmit={handleSubmit}>
			<input
				type="search"
				placeholder="Enter YouTube video url or search term..."
				required
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="search"
			/>
			<button type="submit" className="submit">
				<MdSearch className="icon" />
			</button>
			<button className="clear" type="reset">
				<MdClear className="icon" />
			</button>
		</form>
	);
};

export default Form;
