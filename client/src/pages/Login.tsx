import { useLocation, useNavigate } from 'react-router-dom'
import { useUserData } from '../contexts/hooks'
import { reqLogin } from '../utils/auth'
import { reqGetUser } from '../utils/user'
import { USER_ACTION } from '../contexts/UserContext'
import toast from '../utils/toast'
import styles from '../styles/Login.module.css'

export default function Login() {
    const { dispatchUser } = useUserData()
    const navigate = useNavigate()
    const location = useLocation()
    const prePage = location.state?.from
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
            })
    }
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
                        placeholder='Email'
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
                        placeholder='Mật khẩu'
                    />
                </div>
                <div className={styles['wrap-input']}>
                    <button className={
                        [
                            'button-d',
                            styles['submit']
                        ].join(' ')}>Đăng nhập</button>
                </div>
            </form>
        </div>
    )
}