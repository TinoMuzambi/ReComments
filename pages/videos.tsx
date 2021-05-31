import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";

const Videos = () => {
	const { signedIn } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/");
	}, []);

	return (
		<div>
			<h1 className="title">Videos</h1>
		</div>
	);
};

export default Videos;
