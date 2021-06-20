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
import Meta from "../components/Meta";
import { postUserToDb } from "../utils";

const SignIn: React.FC = (): JSX.Element => {
	const [loading, setLoading] = useState(false);

	const { setSignedIn, signedIn, setUser, user } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		setLoading(true);
		if (gapi) {
			gapi.load("client:auth2", () => {
				gapi.client
					.init({
						apiKey: process.env.GAPP_API_KEY,
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
		}
	}, [gapi]);

	useEffect(() => {
		if (signedIn) {
			router.push("/search");
		}
	}, [signedIn]);

	useEffect(() => {
		checkUserDb();
	}, [user]);

	const checkUserDb: Function = async () => {
		if (user && user?.emailAddresses && user.names && user.photos) {
			const res = await fetch(
				`/api/users/${user?.emailAddresses[0].metadata?.source?.id}`
			);
			const userRes = await res.json();

			if (!userRes.success) {
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
					await postUserToDb(body);
				} catch (error) {}
			}
		}
	};

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
		<>
			<Meta
				title=" Sign In | ReComments"
				description="Sign into ReComments with your Google account to start commenting!"
				url="https://recomments.tinomuzambi.com/signin"
			/>
			<main className="main">
				<h1 className="title">ReComments</h1>
				<button className="sign-in" onClick={signIn}>
					<FcGoogle className="icon" />
					&nbsp;Sign In with Google
				</button>
			</main>
		</>
	);
};

export default SignIn;
