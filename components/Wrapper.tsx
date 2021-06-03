import { WrapperProps } from "../interfaces";
import { AppProvider } from "../context/AppContext";
import Meta from "./Meta";
import Nav from "./Nav";

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
	return (
		<AppProvider>
			<Meta />
			<Nav />
			{children}
		</AppProvider>
	);
};

export default Wrapper;
