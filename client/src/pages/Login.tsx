import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import appStyles from '../App.module.css';
import { apiLogin } from '../api/auth';
import useAppContext from '../hooks/useAppContext';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/Login.module.css';
import css from '../utils/css';

export default function Login() {
	const language = useLanguage('page.login');
	const [blockSubmit, setBlockSubmit] = useState(true);
	const [isSubmitting, seIsSubmitting] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { DOM } = useAppContext();
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
	const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (blockSubmit) return;
		setBlockSubmit(true);
		seIsSubmitting(true);
		const formData = new FormData(e.currentTarget);
		buttonRef.current?.classList.add(styles['submitting']);
		apiLogin(formData)
			.then(() => {
				navigate(prePage || '/');
			})
			.catch(() => {
				setBlockSubmit(false);
				seIsSubmitting(false);
			}).finally(() => {
				buttonRef.current?.classList.remove(styles['submitting']);
			});
	};
	useEffect(() => {
		if (language) document.title = language?.login;
		if (DOM.titleRef.current) DOM.titleRef.current.textContent = language?.login || '';
	}, [DOM.titleRef, language]);
	return (
		<main className={styles['login-page']}>
			<form onSubmit={handleLogin} className={styles['form']} onInput={handlePreventSubmit}>
				<div className={styles['wrap-input']}>
					<div className={styles['title']}>{language?.login}</div>
				</div>
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
				<div className={styles['wrap-input']}>
					<button
						ref={buttonRef}
						className={
							css(
								appStyles['button-d'],
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
