import { useEffect, useState } from 'react'
import {
    AiOutlineQuestionCircle,
    AiOutlineUser
} from 'react-icons/ai'
import {
    PiBooks,
    PiChalkboardTeacherLight,
    PiExam,
    PiStudent,
} from 'react-icons/pi'
import {
    RxDashboard
} from 'react-icons/rx'
import {
    SiGoogleclassroom
} from 'react-icons/si'
import { Link } from 'react-router-dom'
import useAppContext from '../hooks/useAppContext'
import { NavBarLanguage } from '../models/lang'
import styles from '../styles/NavBar.module.css'

export default function NavBar() {
    const { DOM, user, appLanguage } = useAppContext()
    const [language, setLanguage] = useState<NavBarLanguage>()
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
        fetch(`/langs/component.navbar.${appLanguage.language}.json`)
            .then(res => res.json())
            .then((data: NavBarLanguage) => {
                setLanguage(data)
            })
    }, [appLanguage.language])
    useEffect(() => {
        function updateSize() {
            if (window.innerWidth < 800) DOM.sideBarRef.current?.classList.add(styles['hide'])
            else DOM.sideBarRef.current?.classList.remove(styles['hide'])
        }
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [DOM.sideBarRef])
    useEffect(() => {
        const currentFeature = features[user.user?.role.name as keyof typeof features].find(feature => {
            return feature.to === window.location.pathname.split('/')[1]
        })
        if (currentFeature?.name) document.title = currentFeature.name
        if (currentFeature?.name && DOM.titleRef.current) {
            DOM.titleRef.current.textContent = currentFeature?.name + ' • ' + document.title
        }
    })
    return (
        <div ref={DOM.sideBarRef} className={
            [
                styles['nav-bar'],
                window.innerWidth < 800 ? styles['hide'] : ''
            ].join(' ')
        }>
            <ul className={styles['list']}>{
                features[user.user?.role.name as keyof typeof features]?.map((feature, index) => {
                    return (
                        <li onClick={e => {
                            e.currentTarget.querySelector('a')?.click()
                            if (window.innerWidth < 800) DOM.sideBarRef.current?.classList.add(styles['hide'])
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