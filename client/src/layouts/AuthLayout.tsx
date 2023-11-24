import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { reqGetUser } from '../utils/user'
import { useAppContext } from '../contexts/hooks'
import { USER_ACTION } from '../contexts/UserContext'
import styles from '../styles/AuthLayout.module.css'
import Footer from '../components/Footer'

export default function AuthLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAppContext()
    useEffect(() => {
        const prePage = location.state?.from
        reqGetUser()
            .then(data => {
                user.dispatchUser({ type: USER_ACTION.SET, payload: data })
                navigate(prePage?.pathname || '/')
            })
            .catch(() => {
                document.querySelector('.pre-load-container')?.classList.add('hide')
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className={styles['auth-layout']}>
            <Outlet />
            <Footer />
        </div >
    )
}