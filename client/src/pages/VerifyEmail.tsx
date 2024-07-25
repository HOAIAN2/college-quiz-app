import { useLocation } from 'react-router-dom';
import { apiVerifyEmail } from '../api/auth';
import appStyles from '../App.module.css';
import styles from '../styles/VerifyEmail.module.css';
import css from '../utils/css';

export default function VerifyEmail() {
	const { state: email } = useLocation() as { state: string | null; };
	console.log(email);
	const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const code = formData.get('code');
		console.log(code);
		apiVerifyEmail(String(email), String(code))
			.then(() => {
				//
			});

	};

	return (
		<main className={styles['verify-email-page']}>
			<form onSubmit={handleVerify} className={styles['form-data']} >
				<input readOnly hidden type="text" value={String(email)} />
				<h2>{'Email Verification'}</h2>
				<p>We just send you a verify code to
					<b>demo@demo.com</b>
				</p>
				<div className={styles['wrap-item']}>
					<label className={styles['required']} htmlFor='code'>Verification code</label>
					<input
						id='code'
						name='code'
						className={css(appStyles['input-d'], styles['input-item'])}
						type='text'
						placeholder={new Date().getFullYear().toString()}
					/>
				</div>
				<div className={styles['wrap-item']}>
					<button
						className={css(appStyles['button-d'], styles['input-item'])}>
						Verify
					</button>
				</div>
			</form>
		</main>
	);
}
