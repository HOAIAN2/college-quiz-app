import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiLogin } from '../api/auth'
import { apiGetUser } from '../api/user'
import { USER_ACTION } from '../contexts/UserContext'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { LoginPageLanguage } from '../models/lang'
import styles from '../styles/Login.module.css'

export default function Login() {
    const language = useLanguage<LoginPageLanguage>('page.login')
    const [blockSubmit, setBlockSubmit] = useState(true)
    const [isSubmitting, seIsSubmitting] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const { user } = useAppContext()
    const navigate = useNavigate()
    const location = useLocation()
    const prePage = location.state?.from
    const handlePreventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget)
        if (!formData.get('email') || !formData.get('password')) return setBlockSubmit(true)
        else setBlockSubmit(false)
    }
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (blockSubmit) return
        setBlockSubmit(true)
        seIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        buttonRef.current?.classList.add(styles['submitting'])
        apiLogin(formData)
            .then(() => {
                return apiGetUser()
            })
            .then((data) => {
                user.dispatchUser({ type: USER_ACTION.SET, payload: data })
                navigate(prePage?.pathname || '/')
            })
            .catch(() => {
                setBlockSubmit(false)
                seIsSubmitting(false)
            }).finally(() => {
                buttonRef.current?.classList.remove(styles['submitting'])
            })
    }
    useEffect(() => {
        if (language) document.title = language?.login
    }, [language])
    return (
        <div className={styles['login-page']}>
            <form onSubmit={handleLogin} className={styles['form']} onInput={handlePreventSubmit}>
                <div className={styles['wrap-input']}>
                    <div className={styles['title']}>{language?.login}</div>
                </div>
                <div className={styles['wrap-input']}>
                    <input name='email'
                        autoFocus
                        className={
                            [
                                'input-d',
                                styles['input']
                            ].join(' ')
                        }
                        type='email'
                        placeholder={language?.email}
                    ></input>
                </div>
                <div className={styles['wrap-input']}>
                    <input name='password'
                        className={
                            [
                                'input-d',
                                styles['input']
                            ].join(' ')
                        }
                        type='password'
                        placeholder={language?.password}
                    />
                </div>
                <div className={styles['wrap-input']}>
                    <button
                        ref={buttonRef}
                        className={
                            [
                                'button-d',
                                styles['submit'],
                                blockSubmit && !buttonRef.current?.classList.contains(styles['submitting'])
                                    ? styles['blocking'] : ''
                            ].join(' ')}>{!isSubmitting && language?.login}</button>
                </div>
            </form>
        </div>
    )
}