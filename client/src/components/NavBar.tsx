import { useUserData } from '../contexts/hooks'
import { AiOutlineHome } from 'react-icons/ai'
import styles from '../styles/NavBar.module.css'
import { Link } from 'react-router-dom'

export default function NavBar() {
    const { user } = useUserData()
    console.log(user)
    const features = {
        admin: [
            {
                name: 'Feature',
                to: '',
                icon: <AiOutlineHome />
            },
            {
                name: 'Feature',
                to: '',
                icon: <AiOutlineHome />
            },
            {
                name: 'Feature',
                to: '',
                icon: <AiOutlineHome />
            },
        ],
        teacher: [
            {
                name: 'Feature',
                to: '',
                icon: <AiOutlineHome />
            },
            {
                name: 'Feature',
                to: '',
                icon: <AiOutlineHome />
            },
            {
                name: 'Feature',
                to: '',
                icon: <AiOutlineHome />
            },
        ],
        student: [
            {
                name: 'Feature',
                to: '',
                icon: <AiOutlineHome />
            },
            {
                name: 'Feature',
                to: '',
                icon: <AiOutlineHome />
            },
            {
                name: 'Feature',
                to: '',
                icon: <AiOutlineHome />
            },
        ]
    }
    return (
        <div className={styles['nav-bar']}>
            <ul className={styles['list']}>{
                features[user?.role.name as keyof typeof features].map((feature, index) => {
                    return (
                        <li key={index} className={styles['list-item']}>
                            {feature.icon}
                            <Link to={feature.to}>{feature.name}</Link>
                        </li>
                    )
                })
            }</ul>
        </div>
    )
}