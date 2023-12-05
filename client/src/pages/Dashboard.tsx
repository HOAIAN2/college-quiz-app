import { useQuery } from '@tanstack/react-query'
import { apiGetDashboard } from '../api/dashboard'
import {
    PiStudent,
    PiChalkboardTeacherLight,
    PiExam,
} from 'react-icons/pi'
import {
    SiGoogleclassroom
} from 'react-icons/si'
import styles from '../styles/Dashboard.module.css'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import { useEffect, useState } from 'react'
import { DashboardLanguage } from '../models/lang'
import useAppContext from '../hooks/useAppContext'

export default function Dashboard() {
    const { appLanguage } = useAppContext()
    const [language, setLanguage] = useState<DashboardLanguage>()
    const queryData = useQuery({
        queryKey: ['dashboard'],
        queryFn: apiGetDashboard
    })
    useEffect(() => {
        fetch(`/langs/page.dashboard.${appLanguage.language}.json`)
            .then(res => res.json())
            .then((data: DashboardLanguage) => {
                setLanguage(data)
            })
    }, [appLanguage.language])
    return (
        <div
            className={
                [
                    'dashboard-d',
                    styles['dashboard']
                ].join(' ')
            }
        >
            {queryData.isLoading ?
                <Loading />
                : null}
            {
                !queryData.isError && queryData.data ?
                    <div className={styles['wrap-dasshboard-item']}>
                        <Link
                            to={'/students'}
                            className={
                                [
                                    'dashboard-item-d',
                                    styles['dashboard-item'],
                                    styles['container-blue']
                                ].join(' ')
                            }>
                            <div className={styles['item-left']}>
                                <PiStudent />
                            </div>
                            <div className={styles['item-top']}>{queryData.data?.studentCount}</div>
                            <div className={styles['item-bottom']}>{language?.items.totalStudent}</div>
                        </Link>
                        <Link
                            to={'teachers'}
                            className={
                                [
                                    'dashboard-item-d',
                                    styles['dashboard-item'],
                                    styles['container-blue']
                                ].join(' ')
                            }>
                            <div className={styles['item-left']}>
                                <PiChalkboardTeacherLight />
                            </div>
                            <div className={styles['item-top']}>{queryData.data?.teacherCount}</div>
                            <div className={styles['item-bottom']}>{language?.items.totalTeacher}</div>
                        </Link>
                        <Link
                            to={'courses'}
                            className={
                                [
                                    'dashboard-item-d',
                                    styles['dashboard-item'],
                                    styles['container-blue']
                                ].join(' ')
                            }>
                            <div className={styles['item-left']}>
                                <SiGoogleclassroom />
                            </div>
                            <div className={styles['item-top']}>{queryData.data?.courseCount}</div>
                            <div className={styles['item-bottom']}>{language?.items.courseCount}</div>
                        </Link>
                        <Link
                            to={'exams'}
                            className={
                                [
                                    'dashboard-item-d',
                                    styles['dashboard-item'],
                                    styles['container-blue']
                                ].join(' ')
                            }>
                            <div className={styles['item-left']}>
                                <PiExam />
                            </div>
                            <div className={styles['item-top']}>{queryData.data?.examInThisMonth}</div>
                            <div className={styles['item-bottom']}>{language?.items.examInThisMonth}</div>
                        </Link>
                    </div> : null
            }
        </div>
    )
}