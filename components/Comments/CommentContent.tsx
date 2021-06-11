import { MouseEventHandler, useContext, useEffect, useState } from "react";
import moment from "moment";
import { MdThumbUp, MdThumbDown, MdEdit, MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";

import { AppContext } from "../../context/AppContext";
import CommentForm from "./CommentForm";
import { CommentModel } from "../../interfaces";

const CommentContent: React.FC<any> = ({
	comment,
	replyingProp,
	replyReply,
	id,
	setOpened,
}) => {
	const [replying, setReplying] = useState(false);
	const [editing, setEditing] = useState(false);
	const [optionsVisible, setOptionsVisible] = useState(false);
	const router = useRouter();
	const { user, setUser } = useContext(AppContext);

	useEffect(() => {
		const getDbUser: Function = async () => {
			if (user && user?.emailAddresses && user.names && user.photos) {
				const res = await fetch(
					`/api/users/${user?.emailAddresses[0].metadata?.source?.id}`
				);
				const data = await res.json();
				if (setUser) setUser(data.data);
			}
		};
		getDbUser();
	}, []);

	const deleteHandler: MouseEventHandler<HTMLButtonElement> = async () => {
		await fetch(`/api/comments/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const height = window.scrollY;
		await router.replace(router.asPath);
		setOpened(false);
		window.scrollTo(0, height);
	};

	const upvoteHandler: MouseEventHandler<HTMLButtonElement> = async () => {
		if (user) {
			let body: any = user;

			if (!body.upvotedIds.includes(comment._id)) {
				body = { ...body, upvotedIds: [...body.upvotedIds, comment._id] };

				try {
					console.log(body._id);
					await fetch(`/api/users/${body._id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(body),
					});

					body = comment;

					body = { ...body, upvotes: body.upvotes + 1 };

					await fetch(`/api/comments/${id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(body),
					});
				} catch (error) {
					console.error(error);
				}
			} else {
				console.log("Already liked!");
			}

			setReplying(false);
			setEditing(false);

			const height = window.scrollY;
			await router.replace(router.asPath);
			setOpened(false);
			window.scrollTo(0, height);
		}
	};

	return (
		<div className="content">
			<img src={comment.image} alt={comment.name} className="profile" />
			<div className="details">
				<div className="top">
					<h5 className="name">{comment.name}</h5>
					<p className="datetime">
						{moment(comment.createdAt).fromNow()}{" "}
						{comment?.edited && "(edited)"}
					</p>
				</div>
				<p className="text">
					{comment?.mention && (
						<span className="mention">{comment.mention} </span>
					)}
					{comment.comment}
				</p>
				<div className="actions">
					<div className="upvotes">
						<button className="upvote" onClick={upvoteHandler}>
							<span>
								<MdThumbUp className="icon" />
							</span>
						</button>
						<p className="upvote-count">{comment.upvotes}</p>
					</div>
					<button className="downvote">
						<span>
							<MdThumbDown className="icon" />
						</span>
					</button>
					<button
						className="reply"
						onClick={() => {
							setReplying(true);
							setEditing(false);
						}}
					>
						REPLY
					</button>
				</div>
				{(replying || editing) && (
					<CommentForm
						replying={replyingProp}
						editing={editing}
						setEditing={setEditing}
						replyReplying={replyReply}
						setReplying={setReplying}
						id={id}
						setOpenedProp={setOpened}
						commentProp={comment}
					/>
				)}
			</div>
			<div className="options">
				<button
					className="select"
					onClick={() => setOptionsVisible(!optionsVisible)}
				>
					<BsThreeDotsVertical className="icon" />
				</button>

				<div className={`holder ${optionsVisible && "visible"}`}>
					<button
						className="item"
						onClick={() => {
							setEditing(true);
							setReplying(false);
							setOptionsVisible(false);
						}}
					>
						<MdEdit className="icon" /> <p className="label">Edit</p>
					</button>
					<button className="item" onClick={deleteHandler}>
						<MdDelete className="icon" /> <p className="label">Delete</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommentContent;
