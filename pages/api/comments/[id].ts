import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

import Comment from "../../../models/Comment";
import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";
import { requireGoogleIdentity } from "../../../utils/googleAuth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const {
		query: { id },
		method,
	} = req;
	const commentId = Array.isArray(id) ? id[0] : id;

	switch (method) {
		case "GET":
			try {
				const comment = await Comment.findOne({ id: commentId }).select(
					"-email -replies.email"
				);

				if (!comment) {
					return res
						.status(404)
						.json({ success: false, data: { message: "Comment not found" } });
				}

				res.status(200).json({ success: true, data: comment });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		case "PUT":
			try {
				const identity = await requireGoogleIdentity(req, res);
				if (!identity) return;
				const current: any = await Comment.findOne({ id: commentId }).lean();
				const user: any = await User.findOne({ userId: identity.id }).lean();
				if (!current || !user) {
					return res.status(404).json({ success: false });
				}

				if (
					req.body.id !== current.id ||
					req.body.videoId !== current.videoId ||
					req.body.authorId !== current.authorId
				) {
					return res.status(403).json({ success: false });
				}

				const incomingUpvotes = Number(req.body.upvotes);
				const incomingDownvotes = Number(req.body.downvotes);
				const upvoteDelta = incomingUpvotes - Number(current.upvotes);
				const downvoteDelta = incomingDownvotes - Number(current.downvotes);
				const upvotedIds = new Set<string>((user.upvotedIds || []).map(String));
				const downvotedIds = new Set<string>((user.downvotedIds || []).map(String));
				const validVoteChange = (
					resourceId: string,
					delta: number,
					votedIds: Set<string>
				): boolean =>
					delta === 0 ||
					(delta === 1 && !votedIds.has(resourceId)) ||
					(delta === -1 && votedIds.has(resourceId));
				if (
					!Number.isSafeInteger(incomingUpvotes) ||
					!Number.isSafeInteger(incomingDownvotes) ||
					incomingUpvotes < 0 ||
					incomingDownvotes < 0 ||
					Math.abs(upvoteDelta) > 1 ||
					Math.abs(downvoteDelta) > 1 ||
					(upvoteDelta === 1 && downvoteDelta === 1) ||
					!validVoteChange(String(commentId), upvoteDelta, upvotedIds) ||
					!validVoteChange(String(commentId), downvoteDelta, downvotedIds)
				) {
					return res.status(400).json({ success: false });
				}

				const currentReplies: any[] = current.replies || [];
				const incomingReplies: any[] = Array.isArray(req.body.replies)
					? req.body.replies
					: [];
				if (incomingReplies.length > 500) {
					return res.status(400).json({ success: false });
				}
				const incomingReplyIds = incomingReplies.map((reply) => String(reply.id));
				if (new Set(incomingReplyIds).size !== incomingReplyIds.length) {
					return res.status(400).json({ success: false });
				}
				const currentById = new Map(
					currentReplies.map((reply) => [String(reply.id), reply])
				);
				const newReplies = incomingReplies.filter(
					(reply) => !currentById.has(String(reply.id))
				);
				if (newReplies.length > 1) {
					return res.status(400).json({ success: false });
				}
				if (
					newReplies.some(
						(reply) =>
							!String(reply.id || "").trim() ||
							!String(reply.comment || "").trim()
					)
				) {
					return res.status(400).json({ success: false });
				}

				for (const existing of currentReplies) {
					const incoming = incomingReplies.find(
						(reply) => String(reply.id) === String(existing.id)
					);
					const replyUpvoteDelta =
						Number(incoming?.upvotes) - Number(existing.upvotes);
					const replyDownvoteDelta =
						Number(incoming?.downvotes) - Number(existing.downvotes);
					if (
						incoming &&
						(!Number.isSafeInteger(Number(incoming.upvotes)) ||
							!Number.isSafeInteger(Number(incoming.downvotes)) ||
							Number(incoming.upvotes) < 0 ||
							Number(incoming.downvotes) < 0 ||
							Math.abs(replyUpvoteDelta) > 1 ||
							Math.abs(replyDownvoteDelta) > 1 ||
							(replyUpvoteDelta === 1 && replyDownvoteDelta === 1) ||
							!validVoteChange(String(existing.id), replyUpvoteDelta, upvotedIds) ||
							!validVoteChange(
								String(existing.id),
								replyDownvoteDelta,
								downvotedIds
							))
					) {
						return res.status(400).json({ success: false });
					}
					if (existing.authorId !== identity.id) {
						if (
							!incoming ||
							incoming.authorId !== existing.authorId ||
							incoming.comment !== existing.comment ||
							Math.abs(replyUpvoteDelta) > 1 ||
							Math.abs(replyDownvoteDelta) > 1
						) {
							return res.status(403).json({ success: false });
						}
					}
				}

				const replies = incomingReplies.map((reply) => {
					const existing = currentById.get(String(reply.id));
					if (existing) {
						return {
							...existing,
							comment:
								existing.authorId === identity.id
									? String(reply.comment || "").trim().slice(0, 5000)
									: existing.comment,
							edited:
								existing.authorId === identity.id
									? Boolean(reply.edited)
									: existing.edited,
							upvotes: Math.max(0, Number(reply.upvotes) || 0),
							downvotes: Math.max(0, Number(reply.downvotes) || 0),
						};
					}

					return {
						id: String(reply.id || "").slice(0, 100),
						videoId: current.videoId,
						authorId: identity.id,
						email: identity.email,
						name: user.shortName,
						image: user.photoUrl,
						comment: String(reply.comment || "").trim().slice(0, 5000),
						upvotes: 0,
						downvotes: 0,
						mention: reply.mention ? String(reply.mention).slice(0, 100) : null,
						edited: false,
					};
				});

				const update: any = {
					upvotes: incomingUpvotes,
					downvotes: incomingDownvotes,
					replies,
				};
				if (current.authorId === identity.id) {
					update.comment = String(req.body.comment || "").trim().slice(0, 5000);
					update.edited = Boolean(req.body.edited);
				} else if (
					req.body.comment !== current.comment ||
					Boolean(req.body.edited) !== Boolean(current.edited)
				) {
					return res.status(403).json({ success: false });
				}

				const comment: mongoose.UpdateQuery<any> = await Comment.updateOne(
					{ id: commentId },
					{ $set: update }
				);
				const applyVoteChange = (
					resourceId: string,
					delta: number,
					votedIds: Set<string>
				): void => {
					if (delta === 1) votedIds.add(resourceId);
					if (delta === -1) votedIds.delete(resourceId);
				};
				applyVoteChange(String(commentId), upvoteDelta, upvotedIds);
				applyVoteChange(String(commentId), downvoteDelta, downvotedIds);
				for (const existing of currentReplies) {
					const incoming = incomingReplies.find(
						(reply) => String(reply.id) === String(existing.id)
					);
					if (!incoming) continue;
					applyVoteChange(
						String(existing.id),
						Number(incoming.upvotes) - Number(existing.upvotes),
						upvotedIds
					);
					applyVoteChange(
						String(existing.id),
						Number(incoming.downvotes) - Number(existing.downvotes),
						downvotedIds
					);
				}
				await User.updateOne(
					{ userId: identity.id },
					{ $set: { upvotedIds: [...upvotedIds], downvotedIds: [...downvotedIds] } }
				);

				if (!comment) {
					return res
						.status(400)
						.json({ success: false, data: { message: "Comment not found" } });
				}
				res.status(200).json({ success: true, data: comment });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		case "DELETE":
			try {
				const identity = await requireGoogleIdentity(req, res);
				if (!identity) return;
				const current: any = await Comment.findOne({ id: commentId }).select(
					"authorId"
				);
				if (!current) return res.status(404).json({ success: false });
				if (current.authorId !== identity.id) {
					return res.status(403).json({ success: false });
				}
				const deletedComment = await Comment.deleteOne({ id: commentId });

				if (!deletedComment) {
					return res.status(400).json({ success: false });
				}
				res
					.status(200)
					.json({ success: true, data: { message: "Comment deleted" } });
			} catch (error) {
				return res.status(400).json({ success: false, data: error });
			}
			break;
		default:
			return res.status(400).json({ success: false });
	}
};
