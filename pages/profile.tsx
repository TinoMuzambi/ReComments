import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";

const Profile: React.FC = (): JSX.Element => {
	const { dbUser, signedIn } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (!signedIn) router.push("/signin");
	}, []);
	return (
		<div>
			<h1>profile for {dbUser?.shortName}</h1>
		</div>
	);
};

export default Profile;
