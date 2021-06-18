import { NoticeProps } from "../interfaces";

const Notice: React.FC<NoticeProps> = ({
	title,
	subtitle,
	noButtons,
	firstButtonText,
	secondButtonText,
	confirmCallback,
	cancelCallback,
}) => {
	return (
		<div className="notice">
			<h1 className="title">{title}</h1>
			<h5 className="subtitle">{subtitle}</h5>
			<div className="buttons">
				{noButtons === 1 ? (
					<button className="confirm" onClick={confirmCallback}>
						{firstButtonText}
					</button>
				) : (
					<>
						<button className="confirm" onClick={confirmCallback}>
							{firstButtonText}
						</button>
						<button className="cancel" onClick={cancelCallback}>
							{secondButtonText}
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default Notice;
