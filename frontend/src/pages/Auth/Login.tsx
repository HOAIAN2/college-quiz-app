import appStyles from '~styles/App.module.css';
import styles from './styles/Login.module.css';

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { apiLogin, apiSendEmailVerification } from '~api/auth';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import getCookieValue from '~utils/getCookieValue';

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
        buttonRef.current?.classList.add(styles.submitting);
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
            buttonRef.current?.classList.remove(styles.submitting);
        }
    };
    useEffect(() => {
        if (language) appTitle.setAppTitle(language.login);
    }, [appTitle, language]);
    return (
        <main className={styles.loginPage}>
            <form onSubmit={handleLogin} className={styles.form} onInput={handlePreventSubmit}>
                <h2>{language?.login}</h2>
                <div className={styles.wrapInput}>
                    <input name='email'
                        autoFocus
                        className={css(appStyles.input, styles.input)}
                        type='email'
                        placeholder={language?.email}
                    ></input>
                </div>
                <div className={styles.wrapInput}>
                    <input name='password'
                        className={css(appStyles.input, styles.input)}
                        type='password'
                        placeholder={language?.password}
                    />
                </div>
                <Link className={styles.forgotPassword} to='/auth/forgot-password'>{language?.forgotPassword}</Link>
                <div className={styles.wrapInput}>
                    <button
                        ref={buttonRef}
                        className={
                            css(
                                appStyles.actionItem,
                                styles.submit,
                                blockSubmit && !buttonRef.current?.classList.contains(styles.submitting) ? styles.blocking : ''
                            )
                        }>
                        {!isSubmitting && language?.login}
                    </button>
                </div>
                {
                    getCookieValue('demo_credentials')
                        ?
                        <div className={styles.wrapInput}>
                            <button
                                onClick={() => {
                                    const demoCredentials = getCookieValue('demo_credentials')!;
                                    const email: string = JSON.parse(demoCredentials).email;
                                    const password: string = JSON.parse(demoCredentials).password;
                                    document.querySelector<HTMLInputElement>('input[name="email"]')!.value = email;
                                    document.querySelector<HTMLInputElement>('input[name="password"]')!.value = password;

                                    const event = new Event('input', { bubbles: true });
                                    document.querySelector('form')!.dispatchEvent(event);
                                }}
                                type='button'
                                className={
                                    css(
                                        appStyles.actionItemWhite,
                                        styles.submit,
                                    )
                                }>
                                {language?.demoAccount}
                            </button>
                        </div>
                        : null
                }
            </form>
        </main>
    );
}
