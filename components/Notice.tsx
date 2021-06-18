import { MouseEventHandler } from "react";
import { NoticeProps } from "../interfaces";

const Notice: React.FC<NoticeProps> = ({
	visible,
	title,
	subtitle,
	noButtons,
	firstButtonText,
	secondButtonText,
	confirmCallback,
	cancelCallback,
}) => {
	const confirm: MouseEventHandler<HTMLButtonElement> = () => {
		confirmCallback();
	};

	const cancel: MouseEventHandler<HTMLButtonElement> = () => {
		if (cancelCallback) cancelCallback();
	};

	return (
		<div className={`notice ${visible && "visible"}`}>
			<h1 className="title">{title}</h1>
			<p className="subtitle">{subtitle}</p>
			<div className="buttons">
				{noButtons === 1 ? (
					<button className="confirm" onClick={confirm}>
						{firstButtonText}
					</button>
				) : (
					<>
						<button className="confirm" onClick={confirm}>
							{firstButtonText}
						</button>
						<button className="cancel" onClick={cancel}>
							{secondButtonText}
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default Notice;
