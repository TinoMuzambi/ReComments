import { useEffect, useContext, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { hideNotice, ROLES } from "../utils";
import Meta from "../components/Meta";
import { AdminProps, CommentModel, HomeModel, UserModel } from "../interfaces";
import { MdDelete, MdEdit } from "react-icons/md";
import Link from "next/link";
import moment from "moment";
import Notice from "../components/Notice";

const Admin: NextPage<AdminProps> = ({
	users,
	comments,
	homeVideos,
}): JSX.Element => {
	const [noticeVisible, setNoticeVisible] = useState<boolean>(false);
	const [noticeNoButtons, setNoticeNoButtons] = useState<1 | 2>(1);
	const [noticeTitle, setNoticeTitle] = useState("");
	const [noticeSubtitle, setNoticeSubtitle] = useState("");
	const [noticeFirstButtonText, setNoticeFirstButtonText] = useState("");
	const [noticeSecondButtonText, setNoticeSecondButtonText] = useState("");

	const { dbUser } = useContext(AppContext);

	const router = useRouter();

	useEffect(() => {
		if (!dbUser) router.push("/search");
		else if (dbUser.role === ROLES.standard) router.push("/search");
	}, [dbUser]);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (noticeNoButtons === 1) {
			timer = setTimeout(() => {
				hideNoticeWrapper();
			}, 4000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [noticeVisible]);

	const defaultView = <main className="main">Only for admin users.</main>;

	if (!dbUser) return defaultView;
	else if (dbUser.role === ROLES.standard) return defaultView;

	const hideNoticeWrapper: Function = () => {
		hideNotice(
			setNoticeVisible,
			setNoticeTitle,
			setNoticeSubtitle,
			setNoticeNoButtons,
			setNoticeFirstButtonText,
			setNoticeSecondButtonText
		);
	};

	return (
		<>
			<Meta
				title="Admin | ReComments"
				description="This is the ReComments Admin Panel. Only for authenticated users."
				url="https://recomments.tinomuzambi.com/admin"
			/>
			<main className="container">
				<Notice
					visible={noticeVisible}
					setVisible={setNoticeVisible}
					title={noticeTitle}
					subtitle={noticeSubtitle}
					noButtons={noticeNoButtons}
					firstButtonText={noticeFirstButtonText}
					secondButtonText={noticeSecondButtonText}
					confirmCallback={null}
					cancelCallback={hideNoticeWrapper}
				/>
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
							<p className="label">History</p>
						</div>
						{users?.map((user: UserModel) => (
							<div className="wrapper" key={user.userId}>
								<div className="row">
									<img
										src={user.photoUrl}
										alt={user.name}
										className="profile"
									/>
									<p className="name">{user.name}</p>
									<p className="likes">{user.upvotedIds?.length}</p>
									<p className="dislikes">{user.downvotedIds?.length}</p>
									<p className="dark">{user.darkMode ? "On" : "Off"}</p>
									<p className="emails">{user.emails ? "On" : "Off"}</p>
									<ul className="history">
										{user.watchhistory.map((item) => (
											<li className="history-item" key={item.title}>
												<Link href={`/video/${item.id}`}>
													<a
														title={moment(item.date).format(
															"dddd, DD MMMM YYYY HH:mm:ss"
														)}
													>
														{item.title}
													</a>
												</Link>
											</li>
										))}
									</ul>
								</div>
								<div className="actions">
									<button className="delete">
										<MdDelete className="icon" />
									</button>
								</div>
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
							<div className="wrapper" key={comment.id}>
								<div className="row">
									<p className="author">{comment.name}</p>
									<p className="comment">{comment.comment}</p>
									<p className="video">{comment.videoId}</p>
									<p className="upvotes">{comment.upvotes}</p>
									<p className="downvotes">{comment.downvotes}</p>
									<p className="reples">{comment.replies?.length}</p>
								</div>
								<div className="actions">
									<button className="delete">
										<MdDelete className="icon" />
									</button>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="home">
					<h2 className="subtitle">Home Videos</h2>
					<div className="content-container">
						{homeVideos.videos.map((video: any) => (
							<div className="wrapper" key={video}>
								<div className="row">
									<p>{video}</p>
								</div>
								<div className="actions">
									<button className="edit">
										<MdEdit className="icon" />
									</button>
									<button className="delete">
										<MdDelete className="icon" />
									</button>
								</div>
							</div>
						))}
					</div>
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

	res = await fetch(`${BASE_URL}/api/home`, {
		headers: {
			"Content-Type": "application/json",
		},
	});

	res = await res.json();
	const homeVideos: HomeModel = res.data;

	return {
		users,
		comments,
		homeVideos,
	};
};

export default Admin;
