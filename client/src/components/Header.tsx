import { useRef } from 'react'
import {
    BiLogOut
} from 'react-icons/bi'
import {
    FaRegUser
} from "react-icons/fa6"
import {
    PiSidebarSimpleLight
} from 'react-icons/pi'
import { Link, useNavigate } from 'react-router-dom'
import { apiLogout } from '../api/auth'
import useAppContext from '../hooks/useAppContext'
import styles from '../styles/Header.module.css'
import navBarStyles from '../styles/NavBar.module.css'

export default function Header() {
    const { DOM, user, appLanguage } = useAppContext()
    const navigate = useNavigate()
    const dropContainerRef = useRef<HTMLDivElement>(null)
    const handleLogout = () => {
        apiLogout()
            .finally(() => {
                navigate(0)
            })
    }
    const handleToggle = () => {
        dropContainerRef.current?.classList.toggle(styles['show'])
    }
    const fullName = appLanguage.language === 'vi'
        ? [
            user.user?.lastName,
            user.user?.firstName
        ].join(' ')
        :
        [
            user.user?.firstName,
            user.user?.lastName
        ].join(' ')
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
                {/* <Link to='/profile' className={styles['right-item']}
                    title={fullName}>
                    <FaRegUser />
                </Link> */}
                <span onClick={handleToggle} className={styles['right-item']}>
                    <FaRegUser />
                </span>
                <div onClick={handleToggle} className={styles['drop-down']} ref={dropContainerRef}>
                    <Link to='/profile' className={styles['drop-item']}
                        title={fullName}>
                        <FaRegUser />
                    </Link>
                    <div onClick={handleLogout} className={styles['drop-item']}>
                        <BiLogOut />
                    </div>
                </div>
            </div>
        </div>
    )
}