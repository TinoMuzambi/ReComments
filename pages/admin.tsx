import { useEffect, useContext, useState, FormEventHandler } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import moment from "moment";
import { MdDelete, MdEdit } from "react-icons/md";

import { AppContext } from "../context/AppContext";
import { deleteUser, hideNotice, ROLES, updateHomeVideos } from "../utils";
import Meta from "../components/Meta";
import { AdminProps, CommentModel, HomeModel, UserModel } from "../interfaces";
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
	const [action, setAction] = useState<
		| "deleteComment"
		| "deleteUser"
		| "deleteHomeVideo"
		| "editHomeVideo"
		| "addHomeVideo"
		| ""
	>("");
	const [id, setId] = useState("");
	const [homeVideo, setHomeVideo] = useState("");

	const [usersState, setUsersState] = useState(users);
	// const [commentsState, setCommentssState] = useState(comments);
	const [homeVideosState, sethomeVideosState] = useState(homeVideos);

	const { dbUser } = useContext(AppContext);

	const router = useRouter();

	useEffect(() => {
		// Push to search page if !user or user is not authed.
		if (!dbUser) router.push("/search");
		else if (dbUser.role === ROLES.standard) router.push("/search");
	}, [dbUser]);

	useEffect(() => {
		// Show notice if title non-blank.
		if (noticeTitle !== "") setNoticeVisible(true);
		else hideNoticeWrapper();
	}, [noticeTitle]);

	useEffect(() => {
		// Timer for hiding notice if no interaction with it.
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

	const hideNoticeWrapper: Function = () => {
		// Wrapper for hiding notice.
		hideNotice(
			setNoticeVisible,
			setNoticeTitle,
			setNoticeSubtitle,
			setNoticeNoButtons,
			setNoticeFirstButtonText,
			setNoticeSecondButtonText
		);
	};

	const deleteUserHandler: FormEventHandler<HTMLButtonElement> = async (e) => {
		// Handler for deleting a user.
		e.preventDefault();

		hideNoticeWrapper();
		setAction("deleteUser");
		setNoticeTitle("Delete this user");
		setNoticeSubtitle("Are you sure you want to permanently delete this user?");
		setNoticeNoButtons(2);
		setNoticeFirstButtonText("Yes");
		setNoticeSecondButtonText("Cancel");
	};

	const deleteCommentHandler: FormEventHandler<HTMLButtonElement> = async (
		e
	) => {
		// Handler for deleting a comment. HARDER THAN I THOUGHT.
		e.preventDefault();

		hideNoticeWrapper();
		setAction("deleteComment");
		setNoticeTitle("Delete this comment");
		setNoticeSubtitle(
			"Are you sure you want to permanently delete this comment?"
		);
		setNoticeNoButtons(2);
		setNoticeFirstButtonText("Yes");
		setNoticeSecondButtonText("Cancel");
	};

	const deleteHomeVideoHandler: FormEventHandler<HTMLButtonElement> = async (
		e
	) => {
		// Handler for deleting a home video.
		e.preventDefault();

		hideNoticeWrapper();
		setAction("deleteHomeVideo");
		setNoticeTitle("Delete this home video");
		setNoticeSubtitle(
			"Are you sure you want to permanently delete this home video"
		);
		setNoticeNoButtons(2);
		setNoticeFirstButtonText("Yes");
		setNoticeSecondButtonText("Cancel");
	};

	const editHomeVideoHandler: FormEventHandler<HTMLButtonElement> = async (
		e
	) => {
		// Handler for editing a home video.
		e.preventDefault();

		hideNoticeWrapper();
		setAction("editHomeVideo");
		setNoticeTitle("Edit this home video");
		setNoticeSubtitle(
			"Are you sure you want to permanently edit this home video"
		);
		setNoticeNoButtons(2);
		setNoticeFirstButtonText("Yes");
		setNoticeSecondButtonText("Cancel");
	};

	const addHomeVideoHandler: FormEventHandler<HTMLButtonElement> = async (
		e
	) => {
		// Handler for adding a home video.
		e.preventDefault();

		hideNoticeWrapper();
		setAction("addHomeVideo");
		setNoticeTitle("Add a home video");
		setNoticeSubtitle("Are you sure you want to add a home video");
		setNoticeNoButtons(2);
		setNoticeFirstButtonText("Yes");
		setNoticeSecondButtonText("Cancel");
	};

	const deleteCommentCallback: Function = async () => {
		// TODO
	};

	const deleteUserCallback: Function = async () => {
		// Callback for deleting a user and their comments.
		await deleteUser(id);
		setUsersState(users.filter((user) => user.userId !== id));
		hideNoticeWrapper();
	};

	const deleteHomeVideoCallback: Function = async () => {
		// Callback for deleting a home video.
		const newVideos: HomeModel = { ...homeVideosState };
		let newList = newVideos.videos;

		newList = newList.filter((item) => item !== homeVideo);
		newVideos.videos = newList;

		sethomeVideosState(newVideos);

		await updateHomeVideos(newVideos);

		hideNoticeWrapper();
	};

	const addHomeVideoCallback: Function = async () => {
		// Callback for adding a home video.
		const newVideos: HomeModel = { ...homeVideosState };
		let newList = newVideos.videos;

		const newVideo: string = prompt("Enter a new video:") as string;

		newList.push(newVideo);
		newVideos.videos = newList;

		sethomeVideosState(newVideos);

		await updateHomeVideos(newVideos);

		hideNoticeWrapper();
	};

	const editHomeVideoCallback: Function = async () => {
		// Callback for editing a home video.
		const oldVideo: string = homeVideo;
		const newVideo: string = prompt("Enter a new video:", homeVideo) as string;

		const newVideos: HomeModel = { ...homeVideosState };
		for (let i = 0; i < newVideos.videos.length; i++) {
			if (newVideos.videos[i] === oldVideo) newVideos.videos[i] = newVideo;
		}
		sethomeVideosState(newVideos);

		await updateHomeVideos(newVideos);

		hideNoticeWrapper();
	};

	// Default view for non-authed users
	const defaultView = <main className="main">Only for admin users.</main>;

	// Return default view if !user or user is not authed.
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
				<Notice
					visible={noticeVisible}
					setVisible={setNoticeVisible}
					title={noticeTitle}
					subtitle={noticeSubtitle}
					noButtons={noticeNoButtons}
					firstButtonText={noticeFirstButtonText}
					secondButtonText={noticeSecondButtonText}
					confirmCallback={
						action === "deleteComment"
							? deleteCommentCallback
							: action === "deleteUser"
							? deleteUserCallback
							: action === "deleteHomeVideo"
							? deleteHomeVideoCallback
							: action === "editHomeVideo"
							? editHomeVideoCallback
							: addHomeVideoCallback
					}
					cancelCallback={hideNoticeWrapper}
				/>
				<h1 className="title">Admin Panel</h1>

				<section className="users">
					<h2 className="subtitle">Users ({usersState.length})</h2>

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
						{usersState?.map((user: UserModel) => (
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
									<button
										className="delete"
										onClick={(e) => {
											deleteUserHandler(e);
											setId(user.userId);
										}}
									>
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
									<button className="delete" onClick={deleteCommentHandler}>
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
						{homeVideosState.videos.map((video: any) => (
							<div className="wrapper" key={video}>
								<div className="row">
									<p>{video}</p>
								</div>
								<div className="actions">
									<button
										className="edit"
										onClick={(e) => {
											editHomeVideoHandler(e);
											setHomeVideo(video);
										}}
									>
										<MdEdit className="icon" />
									</button>
									<button
										className="delete"
										onClick={(e) => {
											deleteHomeVideoHandler(e);
											setHomeVideo(video);
										}}
									>
										<MdDelete className="icon" />
									</button>
								</div>
							</div>
						))}
						<button className="add" onClick={addHomeVideoHandler}>
							Add
						</button>
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
