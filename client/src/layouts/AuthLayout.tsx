import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { apiGetUser } from '../api/user'
import Footer from '../components/Footer'
import { USER_ACTION } from '../contexts/UserContext'
import useAppContext from '../hooks/useAppContext'
import styles from '../styles/AuthLayout.module.css'

export default function AuthLayout() {
    const [checking, setChecking] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAppContext()
    useEffect(() => {
        const prePage = location.state?.from
        apiGetUser()
            .then(data => {
                user.dispatchUser({ type: USER_ACTION.SET, payload: data })
                navigate(prePage?.pathname || '/')
            })
            .catch(() => {
                document.querySelector('.pre-load-container')?.classList.add('hide')
                setChecking(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (checking) return null
    return (
        <div className={styles['auth-layout']}>
            <Outlet />
            <Footer />
        </div >
    )
}