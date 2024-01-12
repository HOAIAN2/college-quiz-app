import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { apiGetNavBarItems } from '../api/role-permission'
import { apiGetUser } from '../api/user'
import Footer from '../components/Footer'
import Header from '../components/Header'
import NavBar from '../components/NavBar'
import { USER_ACTION } from '../contexts/UserContext'
import useAppContext from '../hooks/useAppContext'
import styles from '../styles/DashboardLayout.module.css'

export default function DasboardLayout() {
    const { user, navBarFeatures } = useAppContext()
    const [checking, setChecking] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        apiGetUser()
            .then(data => {
                user.dispatchUser({ type: USER_ACTION.SET, payload: data })
                setChecking(false)
                document.querySelector('.pre-load-container')?.classList.add('hide')
            })
            .then(() => {
                return apiGetNavBarItems()
            })
            .then((data) => {
                navBarFeatures.setItems(data)
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