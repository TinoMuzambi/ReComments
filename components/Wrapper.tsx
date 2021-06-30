import { MouseEventHandler, useEffect, useState } from "react";
import { IoMdMoon, IoMdSunny } from "react-icons/io";

import { WrapperProps } from "../interfaces";
import { AppProvider } from "../context/AppContext";
import Meta from "./Meta";
import Nav from "./Nav";

const Wrapper: React.FC<WrapperProps> = ({ children }): JSX.Element => {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		// Get dark mode stat from local storage.
		const darkLocalStorage = JSON.parse(
			localStorage.getItem("recomments-dark") as string
		);
		// If present set it.
		if (darkLocalStorage === true || darkLocalStorage === false) {
			setDark(darkLocalStorage);
			if (darkLocalStorage) document.body.classList.add("dark");
			else document.body.classList.remove("dark");
		}
	}, []);

	const toggleDarkMode: MouseEventHandler<HTMLButtonElement> = () => {
		if (dark) {
			document.body.classList.remove("dark");
			localStorage.setItem("recomments-dark", JSON.stringify(false));
		} else {
			document.body.classList.add("dark");
			localStorage.setItem("recomments-dark", JSON.stringify(true));
		}
		setDark(!dark);
	};
	return (
		<AppProvider>
			<Meta />
			<Nav />
			<button
				data-dark={dark ? "Turn on light mode" : "Turn on dark mode"}
				className="toggle"
				onClick={toggleDarkMode}
			>
				{dark ? <IoMdSunny className="icon" /> : <IoMdMoon className="icon" />}
			</button>
			{children}
		</AppProvider>
	);
};

export default Wrapper;
