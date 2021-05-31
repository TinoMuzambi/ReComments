import { WrapperProps } from "../interfaces";
import { AppProvider } from "../context/AppContext";
import Meta from "../components/Meta";

const Wrapper = ({ children }: WrapperProps) => {
	return (
		<AppProvider>
			<Meta />
			{children}
		</AppProvider>
	);
};

export default Wrapper;
