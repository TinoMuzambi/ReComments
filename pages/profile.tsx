import { useContext } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";

const Profile: React.FC = (): JSX.Element => {
	const { dbUser } = useContext(AppContext);
	const router = useRouter();
	return (
		<div>
			<h1>profile for {dbUser?.shortName}</h1>
		</div>
	);
};

export default Profile;
