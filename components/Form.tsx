import { FormEventHandler, useContext } from "react";
import { MdClear, MdSearch } from "react-icons/md";

import { FormProps } from "../interfaces";
import { AppContext } from "../context/AppContext";

const Form: React.FC<FormProps> = ({
	handleSubmit,
	searchTerm,
	setSearchTerm,
}): JSX.Element => {
	const { setSearchResults } = useContext(AppContext);

	const handleReset: FormEventHandler<HTMLFormElement> = () => {
		if (setSearchResults) setSearchResults(null);
		setSearchTerm("");
	};
	return (
		<form className="form" onSubmit={handleSubmit} onReset={handleReset}>
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
			<button className="clear" type="reset">
				<MdClear className="icon" />
			</button>
		</form>
	);
};

export default Form;
