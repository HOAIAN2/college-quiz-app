import appStyles from '~styles/App.module.css';
import styles from './styles/ForgotPassword.module.css';

import { apiResetPassword, apiSendPasswordResetEmail, apiVerifyPasswordResetCode } from '~api/auth';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ForgotPassword() {
    const language = useLanguage('page.forgot_password');
    const [countDown, setCountDown] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const handleSendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const form = e.target as HTMLFormElement;
        const email = formData.get('email') as string | null;
        form.querySelector('button')?.classList.add(appStyles['button-submitting']);
        if (!email) return;
        apiSendPasswordResetEmail(email)
            .then(() => {
                setCountDown(60);
                searchParams.set('email', btoa(email));
                setSearchParams(searchParams);
            })
            .catch(() => {
                form.querySelector('button')?.classList.remove(appStyles['button-submitting']);
            });
    };
    const handleSubmitCode = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = atob(searchParams.get('email') as string);
        const formData = new FormData(e.currentTarget);
        const verifyCode = formData.get('verify_code') as string | null;
        if (!verifyCode) return;
        apiVerifyPasswordResetCode(email, verifyCode)
            .then(() => {
                searchParams.set('verify_code', btoa(verifyCode));
                setSearchParams(searchParams);
            });
    };
    const handleSubmitPassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        apiResetPassword(formData)
            .then(() => {
                setSearchParams(new URLSearchParams());
                navigate('/');
            });
    };
    const sendVerifyEmail = () => {
        const email = searchParams.get('email');
        if (!email) return;
        setCountDown(60);
        apiSendPasswordResetEmail(email);
    };
    useEffect(() => {
        if (countDown === 0) return;
        const timeoutId = setTimeout(() => {
            setCountDown(pre => pre - 1);
        }, 1000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [countDown]);
    if (!searchParams.has('email')) return (
        <main key={`phase-${1}`} className={styles['forgot-password-page']}>
            <form onSubmit={handleSendEmail} className={styles['form-data']}>
                <h2>{language?.forgotPassword}</h2>
                <p>{language?.enterEmail}</p>
                <div className={styles['wrap-item']}>
                    <label className={appStyles['required']} htmlFor='email'>{language?.email}</label>
                    <input
                        required
                        id='email'
                        name='email'
                        className={css(appStyles['input-d'], styles['input-item'])}
                        type='email'
                        placeholder={'demo@demo.com'}
                    />
                </div>
                <div className={styles['wrap-item']}>
                    <button className={css(appStyles['action-item-d'], styles['input-item'])}>
                        {language?.sendCode}
                    </button>
                </div>
            </form>
        </main>
    );
    if (!searchParams.has('verify_code')) return (
        <main key={`phase-${2}`} className={styles['forgot-password-page']}>
            <form onSubmit={handleSubmitCode} className={styles['form-data']}>
                <h2>{language?.forgotPassword}</h2>
                <p>{language?.emailSentTo} <b>{atob(String(searchParams.get('email')))}</b>.</p>
                <p>{language?.enterRecoveryCode}</p>
                <div className={styles['wrap-item']}>
                    <label className={appStyles['required']} htmlFor='verify_code'>{language?.recoveryCode}</label>
                    <input
                        id='verify_code'
                        name='verify_code'
                        className={css(appStyles['input-d'], styles['input-item'])}
                        type='text'
                        placeholder={new Date().getFullYear().toString()}
                    />
                </div>
                <div className={styles['wrap-item']}>
                    <button className={css(appStyles['action-item-d'], styles['input-item'])}>
                        {language?.verify}
                    </button>
                </div>
                <div className={styles['wrap-item']}>
                    <p>{language?.didNotReceiveEmail} <b
                        className={
                            css(
                                styles['resend-button'],
                                countDown !== 0 ? styles['disabled'] : ''
                            )
                        }
                        onClick={sendVerifyEmail}>
                        {countDown !== 0 ? `${countDown}s` : language?.resend}
                    </b>
                    </p>
                </div>
            </form>
        </main>
    );
    return (
        <main key={`phase-${3}`} className={styles['forgot-password-page']}>
            <form onSubmit={handleSubmitPassword} className={styles['form-data']}>
                <h2>{language?.forgotPassword}</h2>
                <p>{language?.enterNewPassword}</p>
                <input hidden readOnly type='text' name='email' value={atob(String(searchParams.get('email')))} />
                <input hidden readOnly type='text' name='verify_code' value={atob(String(searchParams.get('verify_code')))} />
                <div className={styles['wrap-item']}>
                    <label className={appStyles['required']} htmlFor='password'>{language?.password}</label>
                    <input
                        id='password'
                        name='password'
                        className={css(appStyles['input-d'], styles['input-item'])}
                        type='password'
                    />
                </div>
                <div className={styles['wrap-item']}>
                    <label className={appStyles['required']} htmlFor='password_confirmation'>{language?.confirmPassword}</label>
                    <input
                        id='password_confirmation'
                        name='password_confirmation'
                        className={css(appStyles['input-d'], styles['input-item'])}
                        type='password'
                    />
                </div>
                <div className={styles['wrap-item']}>
                    <button className={css(appStyles['action-item-d'], styles['input-item'])}>
                        {language?.save}
                    </button>
                </div>
            </form>
        </main>
    );
}
