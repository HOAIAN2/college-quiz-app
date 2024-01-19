import { useQuery } from '@tanstack/react-query'
import {
    PiChalkboardTeacherLight,
    PiStudent
} from 'react-icons/pi'
import {
    SiGoogleclassroom
} from 'react-icons/si'
import { apiGetDashboard } from '../api/dashboard'
import DashboardCard from '../components/DashboardCard'
import Loading from '../components/Loading'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageDashBoardLang } from '../models/lang'
import styles from '../styles/Dashboard.module.css'

export default function Dashboard() {
    const { permissions } = useAppContext()
    const language = useLanguage<PageDashBoardLang>('page.dashboard')
    const queryData = useQuery({
        queryKey: ['dashboard'],
        queryFn: apiGetDashboard
    })
    return (
        <div
            className={
                [
                    'dashboard-d',
                    styles['dashboard']
                ].join(' ')
            }
        >
            {queryData.isFetching ?
                <Loading />
                : null}
            {
                !queryData.isError && queryData.data ?
                    <div className={styles['wrap-dasshboard-item']}>
                        <DashboardCard
                            to={permissions.has('user_view') ? '/students' : undefined}
                            color='magenta'
                            content={language?.items.numberOfStudents}
                            data={queryData.data?.numberOfStudents}
                            Icon={PiStudent}
                        />
                        <DashboardCard
                            to={permissions.has('user_view') ? '/teachers' : undefined}
                            color='red'
                            content={language?.items.numberOfTeachers}
                            data={queryData.data?.numberOfTeachers}
                            Icon={PiChalkboardTeacherLight}
                        />
                        <DashboardCard
                            to={permissions.has('course_view') ? '/courses' : undefined}
                            color='green'
                            content={language?.items.numberOfCourses}
                            data={queryData.data?.numberOfCourses}
                            Icon={SiGoogleclassroom}
                        />
                        <DashboardCard
                            to={permissions.has('exam_view') ? '/exams' : undefined}
                            color='blue'
                            content={language?.items.examInThisMonth}
                            data={queryData.data?.examsInThisMonth}
                            Icon={SiGoogleclassroom}
                        />
                    </div> : null
            }
        </div>
    )
}