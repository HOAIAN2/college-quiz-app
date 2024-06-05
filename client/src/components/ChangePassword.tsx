import { useEffect, useRef, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import appStyles from '../App.module.css';
import { apiChangePassword } from '../api/auth';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/ChangePassword.module.css';
import css from '../utils/css';

type ChangePasswordProps = {
	setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ChangePassword({
	setShowPopup
}: ChangePasswordProps) {
	const language = useLanguage('component.change_password');
	const [blockSubmit, setBlockSubmit] = useState(true);
	const [isSubmitting, seIsSubmitting] = useState(false);
	const [hide, setHide] = useState(true);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const navigate = useNavigate();
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopup(false);
		}, TRANSITION_TIMING_FAST);
	};
	const handlePreventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		const formData = new FormData(e.currentTarget);
		for (const pair of formData.entries()) {
			const value = pair[1] as string;
			if (!value.trim()) {
				return setBlockSubmit(true);
			}
		}
		setBlockSubmit(false);
	};
	const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (blockSubmit) return;
		setBlockSubmit(true);
		seIsSubmitting(true);
		const formData = new FormData(e.currentTarget);
		buttonRef.current?.classList.add(styles['submitting']);
		apiChangePassword(formData)
			.then(() => {
				return navigate(0);
			})
			.catch(() => {
				setBlockSubmit(false);
				seIsSubmitting(false);
			}).finally(() => {
				buttonRef.current?.classList.remove(styles['submitting']);
			});
	};
	useEffect(() => {
		setHide(false);
	}, []);
	return (
		<div className={
			css(
				styles['change-password-container'],
				hide ? styles['hide'] : ''
			)
		}>
			<div className={
				css(
					styles['change-password-form'],
					hide ? styles['hide'] : ''
				)
			}>
				<div className={styles['header']}>
					<h2 className={styles['title']}>{language?.title}</h2>
					<div className={styles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<form onSubmit={handleChangePassword}
					onInput={handlePreventSubmit}
					className={styles['form-data']}>
					<div className={styles['group-inputs']}>
						<div className={styles['wrap-item']}>
							<label className={styles['required']} htmlFor=''>{language?.password}</label>
							<input
								name='current_password'
								className={css(appStyles['input-d'], styles['input-item'])}
								type='password' />
						</div>
						<div className={styles['wrap-item']}>
							<label className={styles['required']} htmlFor=''>{language?.newPassword}</label>
							<input
								name='password'
								className={css(appStyles['input-d'], styles['input-item'])}
								type='password' />
						</div>
						<div className={styles['wrap-item']}>
							<label className={styles['required']} htmlFor=''>{language?.confirmPassword}</label>
							<input
								name='password_confirmation'
								className={css(appStyles['input-d'], styles['input-item'])}
								type='password' />
						</div>
						<div className={styles['wrap-item']}>
							<button
								ref={buttonRef}
								className={
									css(
										appStyles['button-d'],
										styles['submit'],
										blockSubmit && !buttonRef.current?.classList.contains(styles['submitting']) ? styles['blocking'] : ''
									)
								}>
								{!isSubmitting && language?.title}
							</button>
						</div>
					</div>
				</form>
			</div >
		</div >
	);
}
