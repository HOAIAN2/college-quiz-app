import { useSearchParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import styles from '../styles/ForgotPassword.module.css';
import css from '../utils/css';

export default function ForgotPassword() {
	const [searchParams, setSearchParams] = useSearchParams();
	const handleSendEmail = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		searchParams.set('email', btoa(formData.get('email') as string));
		setSearchParams(searchParams);
	};
	const handleSubmitCode = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		searchParams.set('verify_code', btoa(formData.get('verify_code') as string));
		setSearchParams(searchParams);
	};
	const handleSubmitPassword = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};
	if (!searchParams.has('email')) return (
		<main key={`phase-${1}`} className={styles['forgot-password-page']}>
			<form onSubmit={handleSendEmail} className={styles['form-data']}>
				<h2>Quên mật khẩu</h2>
				<p>Chúng tôi sẽ gửi mã khôi phục đến email của bạn, vui lòng điền email vào đây</p>
				<div className={styles['wrap-item']}>
					<label className={styles['required']} htmlFor='email'>Email</label>
					<input
						id='email'
						name='email'
						className={css(appStyles['input-d'], styles['input-item'])}
						type='email'
						placeholder={'demo@demo.com'}
					/>
				</div>
				<div className={styles['wrap-item']}>
					<button className={css(appStyles['button-d'], styles['input-item'])}>
						Gửi mã xác nhận
					</button>
				</div>
			</form>
		</main>
	);
	if (!searchParams.has('verify_code')) return (
		<main key={`phase-${2}`} className={styles['forgot-password-page']}>
			<form onSubmit={handleSubmitCode} className={styles['form-data']}>
				<h2>Quên mật khẩu</h2>
				<p>Chúng tôi vừa gửi mã khôi phục tới <b>{searchParams.get('email')}</b>.</p>
				<p>Vui lòng nhập mã khôi phục vào đây</p>
				<div className={styles['wrap-item']}>
					<label className={styles['required']} htmlFor='verify_code'>Mã khôi phục</label>
					<input
						id='verify_code'
						name='verify_code'
						className={css(appStyles['input-d'], styles['input-item'])}
						type='text'
						placeholder={new Date().getFullYear().toString()}
					/>
				</div>
				<div className={styles['wrap-item']}>
					<button className={css(appStyles['button-d'], styles['input-item'])}>
						Xác minh
					</button>
				</div>
				<div className={styles['wrap-item']}>
					<p>Chưa nhận được email? <b style={{ cursor: 'pointer' }}>
						Gửi lại
					</b>
					</p>
				</div>
			</form>
		</main>
	);
	return (
		<main key={`phase-${3}`} className={styles['forgot-password-page']}>
			<form onSubmit={handleSubmitPassword} className={styles['form-data']}>
				<h2>Quên mật khẩu</h2>
				<p>Điền mật khẩu mới vào đây</p>
				<input hidden readOnly type='text' name='email' value={String(searchParams.get('email'))} />
				<input hidden readOnly type='text' name='verify_code' value={String(searchParams.get('verify_code'))} />
				<div className={styles['wrap-item']}>
					<label className={styles['required']} htmlFor='password'>Mật khẩu</label>
					<input
						id='password'
						name='password'
						className={css(appStyles['input-d'], styles['input-item'])}
						type='password'
					/>
				</div>
				<div className={styles['wrap-item']}>
					<label className={styles['required']} htmlFor='password_confirmation'>Nhập lại mật khẩu</label>
					<input
						id='password_confirmation'
						name='password_confirmation'
						className={css(appStyles['input-d'], styles['input-item'])}
						type='password'
					/>
				</div>
				<div className={styles['wrap-item']}>
					<button className={css(appStyles['button-d'], styles['input-item'])}>
						Lưu
					</button>
				</div>
			</form>
		</main>
	);
}
