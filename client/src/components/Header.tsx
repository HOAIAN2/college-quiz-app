import {
    BiLogOut
} from 'react-icons/bi'
import {
    PiSidebarSimpleLight
} from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { apiLogout } from '../api/auth'
import useAppContext from '../hooks/useAppContext'
import styles from '../styles/Header.module.css'
import navBarStyles from '../styles/NavBar.module.css'

export default function Header() {
    const { DOM } = useAppContext()
    const navigate = useNavigate()
    const handleLogout = () => {
        apiLogout()
            .finally(() => {
                navigate(0)
            })
    }
    return (
        <div className={styles['header']}>
            <div id='loader'></div>
            <div className={styles['left-items']}>
                <div className={styles['toggle']} onClick={() => {
                    DOM.sideBarRef.current?.classList.toggle(navBarStyles['hide'])
                }}>
                    <PiSidebarSimpleLight />
                </div>
                <h1 ref={DOM.titleRef} className={styles['app-title']}></h1>
            </div>
            <div className={styles['right-items']}>
                <span onClick={handleLogout} className={styles['right-item']}>
                    <BiLogOut />
                </span>
            </div>
        </div>
    )
}