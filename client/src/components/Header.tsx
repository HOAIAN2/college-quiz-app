import {
    BiLogOut
} from 'react-icons/bi'
import {
    PiSidebarSimpleLight
} from 'react-icons/pi'
import { reqLogout } from '../utils/auth'
import { useSideBarContext } from '../contexts/hooks'
import styles from '../styles/Header.module.css'
import navBarStyles from '../styles/NavBar.module.css'

export default function Header() {
    const sideBarRef = useSideBarContext()
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
            <div className={styles['left-items']}>
                <div className={styles['toggle']} onClick={() => {
                    sideBarRef.current?.classList.toggle(navBarStyles['hide'])
                }}>
                    <PiSidebarSimpleLight />
                </div>
            </div>
            <div id='loader'></div>
            <div className={styles['right-items']}>
                <span onClick={handleLogout} className={styles['right-item']}>
                    <BiLogOut />
                </span>
            </div>
        </div>
    )
}