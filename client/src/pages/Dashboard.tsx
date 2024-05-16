import { useQuery } from '@tanstack/react-query'
import { GrCertificate } from 'react-icons/gr'
import {
	PiChalkboardTeacherLight,
	PiExam,
	PiStudent
} from 'react-icons/pi'
import { apiGetDashboard } from '../api/dashboard'
import DashboardCard from '../components/DashboardCard'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageDashBoardLang } from '../models/lang'
import styles from '../styles/Dashboard.module.css'

export default function Dashboard() {
	const { permissions, appLanguage } = useAppContext()
	const language = useLanguage<PageDashBoardLang>('page.dashboard')
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_DASHBOARD],
		queryFn: apiGetDashboard
	})
	const formatNumber = (number: number) => {
		if (!number) return 0
		return number.toLocaleString(appLanguage.language, {
			notation: 'compact'
		})
	}
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
						<DashboardCard
							to={permissions.has('user_view') ? '/students' : undefined}
							color='magenta'
							content={language?.items.numberOfStudents}
							data={formatNumber(queryData.data?.numberOfStudents)}
							icon={<PiStudent />}
						/>
						<DashboardCard
							to={permissions.has('user_view') ? '/teachers' : undefined}
							color='red'
							content={language?.items.numberOfTeachers}
							data={formatNumber(queryData.data?.numberOfTeachers)}
							icon={<PiChalkboardTeacherLight />}
						/>
						<DashboardCard
							color='green'
							content={language?.items.numberOfCourses}
							data={formatNumber(queryData.data?.numberOfCourses)}
							icon={<GrCertificate />}
						/>
						<DashboardCard
							color='blue'
							content={language?.items.examInThisMonth}
							data={formatNumber(queryData.data?.examsInThisMonth)}
							icon={<PiExam />}
						/>
					</div> : null
			}
		</div>
	)
}
