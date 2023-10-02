import { useEffect, useState } from 'react'
import { useLanguage, useSideBarContext, useUserData } from '../contexts/hooks'
import {
    AiOutlineHome,
    AiOutlineQuestionCircle,
    AiOutlineUser
} from 'react-icons/ai'
import {
    PiStudent,
    PiChalkboardTeacherLight,
    PiBooks,
    PiExam,
} from 'react-icons/pi'
import {
    SiGoogleclassroom
} from 'react-icons/si'
import {
    RxDashboard
} from 'react-icons/rx'
import styles from '../styles/NavBar.module.css'
import { Link } from 'react-router-dom'
import { DashboardLanguage } from '../models/lang'

export default function NavBar() {
    const sideBarRef = useSideBarContext()
    const [language, setLanguage] = useState<DashboardLanguage>()
    const { appLanguage } = useLanguage()
    const { user } = useUserData()
    const features = {
        admin: [
            {
                name: language?.dashboard,
                to: '',
                icon: <RxDashboard />
            },
            {
                name: language?.profile,
                to: 'profile',
                icon: <AiOutlineUser />
            },
            {
                name: language?.teachers,
                to: 'teachers',
                icon: <PiChalkboardTeacherLight />
            },
            {
                name: language?.students,
                to: 'students',
                icon: <PiStudent />
            },
            {
                name: language?.subjects,
                to: 'subjects',
                icon: <PiBooks />
            },
            {
                name: language?.courses,
                to: 'courses',
                icon: <SiGoogleclassroom />
            },
            {
                name: language?.questions,
                to: 'questions',
                icon: <AiOutlineQuestionCircle />
            },
            {
                name: language?.exams,
                to: 'exams',
                icon: <PiExam />
            },
        ],
        teacher: [
            {
                name: language?.profile,
                to: 'profile',
                icon: <AiOutlineHome />
            },
            {
                name: language?.teachers,
                to: 'teachers',
                icon: <AiOutlineHome />
            },
            {
                name: language?.students,
                to: 'students',
                icon: <AiOutlineHome />
            },
            {
                name: language?.subjects,
                to: 'subjects',
                icon: <AiOutlineHome />
            },
            {
                name: language?.courses,
                to: 'courses',
                icon: <AiOutlineHome />
            },
            {
                name: language?.questions,
                to: 'questions',
                icon: <AiOutlineHome />
            },
            {
                name: language?.exams,
                to: 'exams',
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
    useEffect(() => {
        import(`../langs/component.dashboard.${appLanguage}.json`)
            .then((data: DashboardLanguage) => {
                setLanguage(data)
                // document.title = data.login
            })
    }, [appLanguage])
    return (
        <div ref={sideBarRef} className={styles['nav-bar']}>
            <ul className={styles['list']}>{
                features[user?.role.name as keyof typeof features].map((feature, index) => {
                    return (
                        <li onClick={e => {
                            e.currentTarget.querySelector('a')?.click()
                        }} key={index} className={
                            [
                                styles['list-item'],
                                feature.to === window.location.pathname.split('/')[1] ? styles['current'] : ''
                            ].join(' ')
                        }>
                            {feature.icon}
                            <Link to={feature.to}>{feature.name}</Link>
                        </li>
                    )
                })
            }</ul>
        </div>
    )
}