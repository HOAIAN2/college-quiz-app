import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUserData } from '../contexts/hooks'
import { reqGetUser } from '../utils/user'
import { USER_ACTION } from '../contexts/UserContext'
import Header from '../components/Header'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import styles from '../styles/DashboardLayout.module.css'

export default function DasboardLayout() {
    const { dispatchUser } = useUserData()
    const [checking, setChecking] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        reqGetUser()
            .then(data => {
                dispatchUser({ type: USER_ACTION.SET, payload: data })
                setChecking(false)
            })
            .catch(() => {
                setChecking(false)
                navigate('/auth/login')
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (checking) return null
    return (
        <div className={styles['dashboard-layout']}>
            <Header />
            <div className={styles['dashboard-content']}>
                <NavBar />
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}