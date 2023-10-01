import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage, useUserData } from '../contexts/hooks'
import { reqLogin } from '../utils/auth'
import { reqGetUser } from '../utils/user'
import { USER_ACTION } from '../contexts/UserContext'
import toast from '../utils/toast'
import styles from '../styles/Login.module.css'
import { LoginPageLanguage } from '../models/lang'

export default function Login() {
    const [language, setLanguage] = useState<LoginPageLanguage>()
    const [submitting, setSubmitting] = useState(false)
    const { dispatchUser } = useUserData()
    const { appLanguage } = useLanguage()
    const navigate = useNavigate()
    const location = useLocation()
    const prePage = location.state?.from
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (submitting) return
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)
        reqLogin(formData)
            .then(() => {
                return reqGetUser()
            })
            .then((data) => {
                dispatchUser({ type: USER_ACTION.SET, payload: data })
                navigate(prePage?.pathname || '/')
            })
            .catch((error: Error) => {
                toast.error(error.message)
                setSubmitting(false)
            })
    }
    useEffect(() => {
        import(`../langs/page.login.${appLanguage}.json`)
            .then((data: LoginPageLanguage) => {
                setLanguage(data)
                document.title = data.login
            })
    }, [appLanguage])
    return (
        <div className={styles['login-page']}>
            <form onSubmit={handleLogin} className={styles['form']}>
                <div className={styles['wrap-input']}>
                    <div className={styles['title']}>Quiz</div>
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
                    <button className={
                        [
                            'button-d',
                            styles['submit'],
                            submitting ? styles['submitting'] : ''
                        ].join(' ')}>{language?.login}</button>
                </div>
            </form>
        </div>
    )
}