import { useQuery } from '@tanstack/react-query'
import { reqGetDashboard } from '../utils/dashboard'
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

export default function Dashboard() {
    const queryData = useQuery({
        queryKey: ['dashboard'],
        queryFn: reqGetDashboard
    })
    if (queryData.isLoading) return <div className='data-loading'>Loading...</div>
    if (queryData.isError) return <div className='data-loading'>Loading...</div>
    return (
        <div
            className={
                [
                    'dashboard-d',
                    styles['dashboard']
                ].join(' ')
            }
        >
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
                    <div className={styles['item-bottom']}>Số lượng học sinh</div>
                </Link>
                <Link
                    to={'teachers'}
                    className={
                        [
                            'dashboard-item-d',
                            styles['dashboard-item'],
                            styles['container-red']
                        ].join(' ')
                    }>
                    <div className={styles['item-left']}>
                        <PiChalkboardTeacherLight />
                    </div>
                    <div className={styles['item-top']}>{queryData.data?.teacherCount}</div>
                    <div className={styles['item-bottom']}>Số lượng giáo viên</div>
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
                    <div className={styles['item-bottom']}>Khóa học hiện tại</div>
                </Link>
                <Link
                    to={'exams'}
                    className={
                        [
                            'dashboard-item-d',
                            styles['dashboard-item'],
                            styles['container-red']
                        ].join(' ')
                    }>
                    <div className={styles['item-left']}>
                        <PiExam />
                    </div>
                    <div className={styles['item-top']}>{queryData.data?.examInThisMonth}</div>
                    <div className={styles['item-bottom']}>Bài thi tháng này</div>
                </Link>
            </div>
        </div>
    )
}