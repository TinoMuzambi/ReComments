import { useEffect, useContext } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { ROLES } from "../utils";
import Meta from "../components/Meta";
import { AdminProps, UserModel } from "../interfaces";

const Admin: NextPage<AdminProps> = ({ users }): JSX.Element => {
	const { dbUser } = useContext(AppContext);

	const router = useRouter();

	useEffect(() => {
		if (!dbUser) router.push("/search");
		else if (dbUser.role === ROLES.standard) router.push("/search");
	}, [dbUser]);

	const defaultView = <main className="main">Only for admin users.</main>;

	if (!dbUser) return defaultView;
	else if (dbUser.role === ROLES.standard) return defaultView;
	console.log(users);

	return (
		<>
			<Meta
				title="Admin | ReComments"
				description="This is the ReComments Admin Panel. Only for authenticated users."
				url="https://recomments.tinomuzambi.com/admin"
			/>
			<main className="container">
				<h1 className="title">Admin Panel</h1>

				<section className="users">
					<h2 className="subtitle">Users</h2>
					{users?.map((user: UserModel) => (
						<p>{user.name}</p>
					))}
				</section>

				<section className="comments">
					<h2 className="subtitle">Comments</h2>
				</section>

				<section className="home">
					<h2 className="subtitle">Home Videos</h2>
				</section>
			</main>
		</>
	);
};

Admin.getInitialProps = async (req) => {
	const BASE_URL =
		process.env.NODE_ENV === "production"
			? "https://recomments.tinomuzambi.com"
			: "http://localhost:3000";
	const body = {
		secret: process.env.SECRET,
	};
	let res: any = await fetch(`${BASE_URL}/api/users`, {
		headers: {
			"Content-Type": "application/json",
			usersSecret: JSON.stringify(body),
		},
	});

	res = await res.json();
	const users: UserModel[] = res.data;

	return {
		users,
	};
};

export default Admin;
