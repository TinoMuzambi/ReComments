import type { NextApiRequest, NextApiResponse } from "next";

export type GoogleIdentity = {
	email: string;
	id: string;
};

export const requireGoogleIdentity = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<GoogleIdentity | null> => {
	const authorization = req.headers.authorization;
	const token = authorization?.startsWith("Bearer ")
		? authorization.slice("Bearer ".length).trim()
		: "";

	if (!token) {
		res.status(401).json({ success: false, message: "Not authenticated" });
		return null;
	}

	try {
		const response = await fetch(
			`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(
				token
			)}`
		);
		const payload = await response.json();
		const expectedAudience = process.env.NEXT_PUBLIC_GAPP_CLIENT_ID;
		const id = payload.sub || payload.user_id;

		if (
			!response.ok ||
			!expectedAudience ||
			payload.aud !== expectedAudience ||
			!id ||
			!payload.email ||
			payload.email_verified === "false" ||
			Number(payload.expires_in) <= 0
		) {
			res.status(401).json({ success: false, message: "Invalid session" });
			return null;
		}

		return { id: String(id), email: String(payload.email).toLowerCase() };
	} catch (error) {
		console.error("Google token validation failed", error);
		res.status(503).json({ success: false, message: "Authentication unavailable" });
		return null;
	}
};
