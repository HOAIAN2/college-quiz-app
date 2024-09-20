import appStyles from '~styles/App.module.css';
import styles from './styles/VerifyEmail.module.css';

import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { apiSendEmailVerification, apiVerifyEmail } from '~api/auth';
import useLanguage from '~hooks/useLanguage';
import { User } from '~models/user';
import css from '~utils/css';

export default function VerifyEmail() {
    const [countDown, setCountDown] = useState(0);
    const navigate = useNavigate();
    const language = useLanguage('page.verify_email');
    const { state: user } = useLocation() as { state: User | null; };
    const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;
        const formData = new FormData(e.currentTarget);
        const verifyCode = formData.get('verify_code') as string | null;
        if (user.email && verifyCode) {
            apiVerifyEmail(user.email, verifyCode)
                .then(() => {
                    navigate('/');
                });
        }
    };
    const sendVerifyEmail = () => {
        if (!user) return;
        setCountDown(60);
        apiSendEmailVerification(user.email);
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
    if (!user) return <Navigate to='/' />;
    return (
        <main className={styles.verifyEmailPage}>
            <form onSubmit={handleVerify} className={styles.formData}>
                <h2>{language?.emailVerification}</h2>
                <p>{language?.verificationMessage} <b>{user?.email}</b>.</p>
                <p>{language?.enterCodePrompt}</p>
                <div className={styles.wrapItem}>
                    <label className={appStyles.required} htmlFor='verify_code'>{language?.verificationCodeLabel}</label>
                    <input
                        required
                        id='verify_code'
                        name='verify_code'
                        className={css(appStyles.input, styles.inputItem)}
                        type='text'
                        placeholder={new Date().getFullYear().toString()}
                    />
                </div>
                <div className={styles.wrapItem}>
                    <button className={css(appStyles.actionItem, styles.inputItem)}>
                        {language?.verify}
                    </button>
                </div>
                <div className={styles.wrapItem}>
                    <p>{language?.resendMessage} <b
                        className={
                            css(
                                styles.resendButton,
                                countDown !== 0 ? styles.disabled : ''
                            )
                        }
                        onClick={sendVerifyEmail} >
                        {countDown !== 0 ? `${countDown}s` : language?.resend}
                    </b>
                    </p>
                </div>
            </form>
        </main>
    );
}
