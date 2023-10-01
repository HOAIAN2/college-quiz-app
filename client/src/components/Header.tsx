import { BiLogOut } from 'react-icons/bi'
import styles from '../styles/Header.module.css'
import { reqLogout } from '../utils/auth'

export default function Header() {
    const handleLogout = () => {
        reqLogout()
            .then(() => {
                window.location.pathname = '/auth/login'
            })
            .catch(() => {
                window.location.pathname = '/auth/login'
            })
    }
    return (
        <div className={styles['header']}>
            <div id='loader'></div>
            <div className={styles['left-items']}>
                <span onClick={handleLogout} className={styles['left-item']}>
                    <BiLogOut />
                </span>
            </div>
        </div>
    )
}