import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import appStyles from '../App.module.css';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import styles from '../styles/YesNoPopUp.module.css';
import css from '../utils/css';
import Loading from './Loading';

type YesNoPopUpProps = {
	message: string;
	mutateFunction: () => Promise<unknown>;
	onMutateSuccess: () => void;
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
	langYes?: string;
	langNo?: string;
};
export default function YesNoPopUp({
	message,
	mutateFunction,
	onMutateSuccess,
	setShowPopUp,
	langYes,
	langNo
}: YesNoPopUpProps) {
	const [hide, setHide] = useState(true);
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopUp(false);
		}, TRANSITION_TIMING_FAST);
	};
	const mutation = useMutation({
		mutationFn: mutateFunction,
		onSuccess: () => {
			onMutateSuccess();
			handleClosePopUp();
		}
	});
	useEffect(() => {
		setHide(false);
	}, []);
	return (
		<div
			className={
				css(
					styles['yes-no-pop-up-container'],
					hide ? styles['hide'] : ''
				)
			}>
			{
				mutation.isPending ? <Loading /> : null
			}
			<div
				className={
					css(
						styles['yes-no-pop-up-form'],
						hide ? styles['hide'] : ''
					)
				}>
				<div className={styles['header']}>
					<div
						className={styles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<div className={styles['form-data']}>
					<div className={styles['message']} >
						<div className={styles['message-content']}>
							{message}
						</div>
					</div>
					<div className={styles['action-items']}>
						<button
							onClick={handleClosePopUp}
							className={
								css(
									appStyles['action-item-white-border-red-d'],
									mutation.isPending ? styles['pending'] : ''
								)
							}>
							{langNo}
						</button>
						<button
							onClick={() => { mutation.mutate(); }}
							className={
								css(
									appStyles['action-item-white-d'],
									mutation.isPending ? styles['pending'] : ''
								)
							}>
							{langYes}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
