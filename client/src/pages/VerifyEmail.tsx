import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { apiSendEmailVerification, apiVerifyEmail } from '../api/auth';
import appStyles from '../App.module.css';
import useLanguage from '../hooks/useLanguage';
import { User } from '../models/user';
import styles from '../styles/VerifyEmail.module.css';
import css from '../utils/css';

export default function VerifyEmail() {
	const navigate = useNavigate();
	const language = useLanguage('page.verify_email');
	const { state: user } = useLocation() as { state: User | null; };
	const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!user) return;
		const formData = new FormData(e.currentTarget);
		const code = String(formData.get('code'));
		if (user.email && code) {
			apiVerifyEmail(user.email, code)
				.then(() => {
					navigate('/');
				});
		}
	};
	const sendVerifyEmail = () => {
		if (!user) return;
		apiSendEmailVerification(user.email);
	};
	if (!user) return <Navigate to='/' />;
	return (
		<main className={styles['verify-email-page']}>
			<form onSubmit={handleVerify} className={styles['form-data']}>
				<h2>{language?.emailVerification}</h2>
				<p>{language?.verificationMessage} <b>{user?.email || 'your email address'}</b>.</p>
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
				<div className={styles['wrap-item']}>
					<p>{language?.resendMessage} <b onClick={sendVerifyEmail} style={{ cursor: 'pointer' }}>{language?.resend}</b></p>
				</div>
			</form>
		</main>
	);
}
