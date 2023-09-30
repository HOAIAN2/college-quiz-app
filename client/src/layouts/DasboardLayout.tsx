import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUserData } from '../contexts/hooks'
import { reqGetUser } from '../utils/user'
import { USER_ACTION } from '../contexts/UserContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function DasboardLayout() {
    const { dispatchUser } = useUserData()
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        reqGetUser()
            .then(data => {
                dispatchUser({ type: USER_ACTION.SET, payload: data })
                setIsFirstLoad(false)
            })
            .catch(() => {
                setIsFirstLoad(false)
                navigate('/auth/login')
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (isFirstLoad) return
        const items = document.querySelectorAll('.loading, .pre-load')
        items.forEach(node => { node.remove() })
    }, [isFirstLoad])
    if (isFirstLoad) return null
    return (
        <div>
            <Header />
            <div>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}