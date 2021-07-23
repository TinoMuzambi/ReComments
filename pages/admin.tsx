import { useEffect, useContext } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { ROLES } from "../utils";
import Meta from "../components/Meta";
import { AdminProps, CommentModel, UserModel } from "../interfaces";

const Admin: NextPage<AdminProps> = ({ users, comments }): JSX.Element => {
	const { dbUser } = useContext(AppContext);

	const router = useRouter();

	useEffect(() => {
		if (!dbUser) router.push("/search");
		else if (dbUser.role === ROLES.standard) router.push("/search");
	}, [dbUser]);

	const defaultView = <main className="main">Only for admin users.</main>;

	if (!dbUser) return defaultView;
	else if (dbUser.role === ROLES.standard) return defaultView;

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
					<h2 className="subtitle">Users ({users.length})</h2>

					<div className="content-container">
						<div className="labels">
							<p className="label">Image</p>
							<p className="label">Name</p>
							<p className="label"># Liked Comments</p>
							<p className="label"># Disliked Comments</p>
							<p className="label">Dark Mode</p>
							<p className="label">Emails</p>
						</div>
						{users?.map((user: UserModel) => (
							<div className="row" key={user.userId}>
								<img src={user.photoUrl} alt={user.name} className="profile" />
								<p className="name">{user.name}</p>
								<p className="likes">{user.upvotedIds?.length}</p>
								<p className="dislikes">{user.downvotedIds?.length}</p>
								<p className="dark">{user.darkMode ? "On" : "Off"}</p>
								<p className="emails">{user.emails ? "On" : "Off"}</p>
							</div>
						))}
					</div>
				</section>

				<section className="comments">
					<h2 className="subtitle">Comments ({comments.length})</h2>
					<div className="content-container">
						<div className="labels">
							<p className="label">Author</p>
							<p className="label">Comment</p>
							<p className="label">Video</p>
							<p className="label"># Likes</p>
							<p className="label"># Dislikes</p>
							<p className="label"># Replies</p>
							{/* <p className="label">Emails</p> */}
						</div>
						{comments.map((comment: CommentModel) => (
							<div className="row" key={comment.id}>
								<p className="author">{comment.name}</p>
								<p className="comment">{comment.comment}</p>
								<p className="video">{comment.videoId}</p>
								<p className="upvotes">{comment.upvotes}</p>
								<p className="downvotes">{comment.downvotes}</p>
								<p className="reples">{comment.replies?.length}</p>
							</div>
						))}
					</div>
				</section>

				<section className="home">
					<h2 className="subtitle">Home Videos</h2>
				</section>
			</main>
		</>
	);
};

Admin.getInitialProps = async () => {
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

	res = await fetch(`${BASE_URL}/api/comments`, {
		headers: {
			"Content-Type": "application/json",
		},
	});

	res = await res.json();
	const comments: CommentModel[] = res.data;

	return {
		users,
		comments,
	};
};

export default Admin;
