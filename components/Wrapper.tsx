import { MouseEventHandler, useEffect, useState } from "react";

import { WrapperProps } from "../interfaces";
import { AppProvider } from "../context/AppContext";
import Meta from "./Meta";
import Nav from "./Nav";

const Wrapper: React.FC<WrapperProps> = ({ children }): JSX.Element => {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		if (dark) {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}
	}, [dark]);

	const toggleDarkMode: MouseEventHandler<HTMLButtonElement> = () => {
		setDark(!dark);
	};
	return (
		<AppProvider>
			<Meta />
			<Nav />
			<button className="toggle" onClick={toggleDarkMode}>
				Dark
			</button>
			{children}
		</AppProvider>
	);
};

export default Wrapper;
