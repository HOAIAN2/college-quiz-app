import { useEffect, useState } from 'react'
import { useLanguage, useDOMContext, useUserData } from '../contexts/hooks'
import {
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
    const { sideBarRef, titleRef } = useDOMContext()
    const [language, setLanguage] = useState<DashboardLanguage>()
    const { appLanguage } = useLanguage()
    const { user } = useUserData()
    // if (user) user.role.name = 'teacher'
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
        student: [
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
        ]
    }
    useEffect(() => {
        import(`../langs/component.dashboard.${appLanguage}.json`)
            .then((data: DashboardLanguage) => {
                setLanguage(data)
            })
    }, [appLanguage])
    useEffect(() => {
        function updateSize() {
            if (window.innerWidth < 800) sideBarRef.current?.classList.add(styles['hide'])
            else sideBarRef.current?.classList.remove(styles['hide'])
        }
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [sideBarRef])
    useEffect(() => {
        const currentFeature = features[user?.role.name as keyof typeof features].find(feature => {
            return feature.to === window.location.pathname.split('/')[1]
        })
        if (currentFeature?.name) document.title = currentFeature.name
        if (currentFeature?.name && titleRef.current) {
            titleRef.current.textContent = currentFeature?.name + ' • ' + document.title
        }
    })
    return (
        <div ref={sideBarRef} className={
            [
                styles['nav-bar'],
                window.innerWidth < 800 ? styles['hide'] : ''
            ].join(' ')
        }>
            <ul className={styles['list']}>{
                features[user?.role.name as keyof typeof features]?.map((feature, index) => {
                    return (
                        <li onClick={e => {
                            e.currentTarget.querySelector('a')?.click()
                            if (window.innerWidth < 800) sideBarRef.current?.classList.add(styles['hide'])
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