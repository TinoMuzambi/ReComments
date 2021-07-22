import { useEffect, useContext } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { ROLES } from "../utils";

const Admin: React.FC = (): JSX.Element => {
	const { dbUser } = useContext(AppContext);

	const router = useRouter();

	useEffect(() => {
		if (dbUser?.role === ROLES.standard) router.push("/search");
	}, [dbUser]);

	return <main className="main">Admin</main>;
};

export default Admin;
