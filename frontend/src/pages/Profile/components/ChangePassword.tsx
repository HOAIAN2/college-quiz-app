import appStyles from '~styles/App.module.css';
import styles from '../styles/ChangePassword.module.css';

import { useEffect, useRef, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { apiChangePassword } from '~api/auth';
import CSS_TIMING from '~constants/css-timing';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';

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
        }, CSS_TIMING.TRANSITION_TIMING_FAST);
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
        buttonRef.current?.classList.add(styles.submitting);
        apiChangePassword(formData)
            .then(() => {
                return navigate(0);
            })
            .catch(() => {
                setBlockSubmit(false);
                seIsSubmitting(false);
            }).finally(() => {
                buttonRef.current?.classList.remove(styles.submitting);
            });
    };
    useEffect(() => {
        setHide(false);
    }, []);
    return (
        <div className={
            css(
                styles.changePasswordContainer,
                hide ? styles.hide : ''
            )
        }>
            <div className={
                css(
                    styles.changePasswordForm,
                    hide ? styles.hide : ''
                )
            }>
                <div className={styles.header}>
                    <h2 className={styles.title}>{language?.title}</h2>
                    <div className={styles.escButton}
                        onClick={handleClosePopUp}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <form onSubmit={handleChangePassword}
                    onInput={handlePreventSubmit}
                    className={styles.formData}>
                    <div className={styles.groupInputs}>
                        <div className={styles.wrapItem}>
                            <label className={appStyles.required} htmlFor=''>{language?.password}</label>
                            <input
                                name='current_password'
                                className={css(appStyles.input, styles.inputItem)}
                                type='password' />
                        </div>
                        <div className={styles.wrapItem}>
                            <label className={appStyles.required} htmlFor=''>{language?.newPassword}</label>
                            <input
                                name='password'
                                className={css(appStyles.input, styles.inputItem)}
                                type='password' />
                        </div>
                        <div className={styles.wrapItem}>
                            <label className={appStyles.required} htmlFor=''>{language?.confirmPassword}</label>
                            <input
                                name='password_confirmation'
                                className={css(appStyles.input, styles.inputItem)}
                                type='password' />
                        </div>
                        <div className={styles.wrapItem}>
                            <button
                                ref={buttonRef}
                                className={
                                    css(
                                        appStyles.actionItem,
                                        styles.submit,
                                        blockSubmit && !buttonRef.current?.classList.contains(styles.submitting) ? styles.blocking : ''
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
