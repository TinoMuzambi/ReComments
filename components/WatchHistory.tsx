import { MouseEventHandler, useContext } from "react";

import { AppContext } from "../context/AppContext";
import HistoryResult from "../components/HistoryResult";
import { UserModel, WatchHistoryProps } from "../interfaces";
import { postUpdatedResourceToDb } from "../utils";

const WatchHistory: React.FC<WatchHistoryProps> = ({
	hideNoticeWrapper,
	setSpinnerVisible,
	setNoticeTitle,
	setNoticeSubtitle,
	setNoticeFirstButtonText,
	setNoticeSecondButtonText,
	setNoticeNoButtons,
	setDeleteOrSubmitOrClear,
}): JSX.Element => {
	const { dbUser, setDbUser } = useContext(AppContext);

	const clearWatchHistoryHandler: MouseEventHandler<HTMLButtonElement> = () => {
		setDeleteOrSubmitOrClear("clear");
		hideNoticeWrapper();
		setNoticeTitle("Clear watch history");
		setNoticeSubtitle("Are you sure you want to clear your watch history?");
		setNoticeNoButtons(2);
		setNoticeFirstButtonText("Yes");
		setNoticeSecondButtonText("Cancel");
	};

	const clearVideoFromWatchHistory: MouseEventHandler<HTMLButtonElement> | any =
		async (id: string) => {
			setSpinnerVisible(true);
			if (dbUser) {
				const newBody: UserModel = {
					...dbUser,
					watchhistory: dbUser.watchhistory.filter((item) => item.id !== id),
				};
				try {
					await postUpdatedResourceToDb(newBody);
					if (setDbUser) setDbUser(newBody);

					hideNoticeWrapper();
					setNoticeTitle("Video deleted");
					setNoticeSubtitle("The video has been deleted from your history");
					setNoticeNoButtons(1);
					setNoticeFirstButtonText("Ok");
				} catch (error) {
					hideNoticeWrapper();
					setNoticeTitle("Video not deleted");
					setNoticeSubtitle(
						"Something went wrong. Please contact the developer."
					);
					setNoticeNoButtons(1);
					setNoticeFirstButtonText("Ok");
				}
			}
			setSpinnerVisible(false);
		};
	return (
		<section className="history">
			<h1 className="title">Watch History</h1>
			<div className="results">
				{dbUser?.watchhistory.map((item) => (
					<HistoryResult
						clearVideo={clearVideoFromWatchHistory}
						item={item}
						key={item.id + item.title}
					/>
				))}
			</div>

			<button className="clear" onClick={clearWatchHistoryHandler}>
				Clear Watch History
			</button>
		</section>
	);
};

export default WatchHistory;
