import { useEffect, useContext, useState, MouseEventHandler } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import {
	getSignedIn,
	updateSignInStatus,
	handleAuthClick,
} from "../utils/gapi";
import { UserModel } from "../interfaces";

export default function Home() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { setSignedIn, signedIn, setUser, user } = useContext(AppContext);

	const updateContext: Function = (
		res: gapi.client.Response<gapi.client.people.Person>
	) => {
		if (setSignedIn) {
			setSignedIn(true);
			if (setUser) setUser(res);
		}
		router.push("/search");
		setLoading(false);
	};

	const cancelLoading: Function = () => {
		setLoading(false);
	};

	const signIn: MouseEventHandler<HTMLButtonElement> = async () => {
		handleAuthClick();
	};

	useEffect(() => {
		setLoading(true);
		gapi.load("client:auth2", function () {
			gapi.client
				.init({
					apiKey: process.env.GAPI_API_KEY,
					discoveryDocs: [
						"https://people.googleapis.com/$discovery/rest?version=v1",
						"https://youtube.googleapis.com/$discovery/rest?version=v3",
					],
					clientId: process.env.GAPP_CLIENT_ID,
					scope: "profile",
				})
				.then(() => {
					gapi.auth2.getAuthInstance().isSignedIn.listen(() => {
						updateSignInStatus(getSignedIn(), updateContext);
					});

					updateSignInStatus(getSignedIn(), updateContext, cancelLoading);
				})
				.catch((error) => console.error(error));
		});
	}, []);

	useEffect(() => {
		if (signedIn) {
			router.push("/search");
		}
	}, [signedIn]);

	useEffect(() => {
		checkUserDb();
	}, [user]);

	const checkUserDb: Function = async () => {
		console.log("here");
		if (user && user?.emailAddresses && user.names && user.photos) {
			const res = await fetch(
				`/api/users/${user?.emailAddresses[0].metadata?.source?.id}`
			);
			const userRes = await res.json();
			const data = userRes?.data;
			if (!data) {
				const body: UserModel = {
					userId: user.emailAddresses[0].metadata?.source?.id as string,
					email: user.emailAddresses[0].value as string,
					shortName: user.names[0].givenName as string,
					name: user.names[0].displayName as string,
					photoUrl: user.photos[0].url,
					upvotedIds: [],
					downvotedIds: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				try {
					await fetch("/api/users", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(body),
					});
				} catch (error) {}
			}
		}
	};

	if (loading)
		return (
			<main className="main">
				<div className="error-holder">
					<img
						src="https://a.storyblok.com/f/114267/1222x923/8898eb61f4/error.png"
						alt="error"
						className="error-image"
					/>
					<h1 className="error">Loading...</h1>
				</div>
			</main>
		);

	return (
		<main className="main">
			<h1 className="title">ReComments</h1>
			<button className="sign-in" onClick={signIn}>
				<span>
					<FcGoogle />
				</span>
				&nbsp;Sign In with Google
			</button>
		</main>
	);
}
