import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import appStyles from '../App.module.css';
import { apiLogin, apiSendEmailVerification } from '../api/auth';
import useAppContext from '../hooks/useAppContext';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/Login.module.css';
import css from '../utils/css';

export default function Login() {
	const language = useLanguage('page.login');
	const [blockSubmit, setBlockSubmit] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { appTitle } = useAppContext();
	const navigate = useNavigate();
	const location = useLocation();
	const prePage = location.state?.from;
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
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (blockSubmit) return;
		setBlockSubmit(true);
		setIsSubmitting(true);
		const formData = new FormData(e.currentTarget);
		buttonRef.current?.classList.add(styles['submitting']);
		try {
			const data = await apiLogin(formData);
			if (!data.token && !data.user.emailVerifiedAt) {
				await apiSendEmailVerification(data.user.email);
				navigate('/auth/verify-email', { state: data.user });
			} else {
				navigate(prePage || '/');
			}
		} finally {
			setBlockSubmit(false);
			setIsSubmitting(false);
			buttonRef.current?.classList.remove(styles['submitting']);
		}
	};
	useEffect(() => {
		if (language) appTitle.setAppTitle(language.login);
	}, [appTitle, language]);
	return (
		<main className={styles['login-page']}>
			<form onSubmit={handleLogin} className={styles['form']} onInput={handlePreventSubmit}>
				<h2>{language?.login}</h2>
				<div className={styles['wrap-input']}>
					<input name='email'
						autoFocus
						className={css(appStyles['input-d'], styles['input'])}
						type='email'
						placeholder={language?.email}
					></input>
				</div>
				<div className={styles['wrap-input']}>
					<input name='password'
						className={css(appStyles['input-d'], styles['input'])}
						type='password'
						placeholder={language?.password}
					/>
				</div>
				<Link className={styles['forgot-password']} to='/auth/forgot-password'>{language?.forgotPassword}</Link>
				<div className={styles['wrap-input']}>
					<button
						ref={buttonRef}
						className={
							css(
								appStyles['action-item-d'],
								styles['submit'],
								blockSubmit && !buttonRef.current?.classList.contains(styles['submitting']) ? styles['blocking'] : ''
							)
						}>
						{!isSubmitting && language?.login}
					</button>
				</div>
			</form>
		</main>
	);
}
