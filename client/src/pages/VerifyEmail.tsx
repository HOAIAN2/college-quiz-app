import { useLocation } from 'react-router-dom';
import { apiVerifyEmail } from '../api/auth';
import appStyles from '../App.module.css';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/VerifyEmail.module.css';
import css from '../utils/css';

export default function VerifyEmail() {
	const language = useLanguage('page.verify_email');
	const { state: email } = useLocation() as { state: string | null; };
	const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const code = formData.get('code');
		if (email && code) {
			apiVerifyEmail(String(email), String(code))
				.then(() => {
					// Handle successful verification
				})
				.catch(() => {
					// Handle verification error
				});
		}
	};
	return (
		<main className={styles['verify-email-page']}>
			<form onSubmit={handleVerify} className={styles['form-data']}>
				<input readOnly hidden type="text" value={String(email)} />
				<h2>{language?.emailVerification}</h2>
				<p>{language?.verificationMessage} <b>{email || 'your email address'}</b>.</p>
				<p>{language?.enterCodePrompt}</p>
				<div className={styles['wrap-item']}>
					<label className={styles['required']} htmlFor='code'>{language?.verificationCodeLabel}</label>
					<input
						id='code'
						name='code'
						className={css(appStyles['input-d'], styles['input-item'])}
						type='text'
						placeholder={new Date().getFullYear().toString()}
					/>
				</div>
				<div className={styles['wrap-item']}>
					<button className={css(appStyles['button-d'], styles['input-item'])}>
						{language?.verify}
					</button>
				</div>
			</form>
		</main>
	);
}
