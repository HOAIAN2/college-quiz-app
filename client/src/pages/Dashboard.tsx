import { useQuery } from '@tanstack/react-query';
import { GrCertificate } from 'react-icons/gr';
import {
	PiChalkboardTeacherLight,
	PiExam,
	PiStudent
} from 'react-icons/pi';
import { Link } from 'react-router-dom';
import appStyles from '../App.module.css';
import { apiGetDashboard } from '../api/dashboard';
import DashboardCard from '../components/DashboardCard';
import ExamsEachMonthChart from '../components/ExamsEachMonthChart';
import Loading from '../components/Loading';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/Dashboard.module.css';
import css from '../utils/css';

export default function Dashboard() {
	const { permissions, appLanguage } = useAppContext();
	const language = useLanguage('page.dashboard');
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.PAGE_DASHBOARD],
		queryFn: apiGetDashboard
	});
	const formatNumber = (number: number) => {
		return number.toLocaleString(appLanguage.language, {
			notation: 'compact'
		});
	};
	return (
		<main className={css(appStyles['dashboard-d'], styles['dashboard'])}>
			{queryData.isLoading ?
				<Loading />
				: null}
			{
				!queryData.isError && queryData.data ?
					<>
						<section className={styles['wrap-dashboard-item']}>
							<DashboardCard
								to={permissions.has('user_view') ? '/students' : undefined}
								color='magenta'
								content={language?.items.numberOfStudents}
								data={formatNumber(queryData.data?.numberOfStudents)}
								icon={<PiStudent />} />
							<DashboardCard
								to={permissions.has('user_view') ? '/teachers' : undefined}
								color='red'
								content={language?.items.numberOfTeachers}
								data={formatNumber(queryData.data?.numberOfTeachers)}
								icon={<PiChalkboardTeacherLight />} />
							<DashboardCard
								color='green'
								content={language?.items.numberOfCourses}
								data={formatNumber(queryData.data?.numberOfCourses)}
								icon={<GrCertificate />} />
							<DashboardCard
								to={permissions.has('exam_view') ? '/exams' : undefined}
								color='blue'
								content={language?.items.examInThisMonth}
								data={formatNumber(queryData.data?.examsInThisMonth)}
								icon={<PiExam />} />
						</section>
						<div className={css(styles['wrap-sections'])}>
							<section className={css(styles['section'], styles['today-exams-container'])}>
								<h2
									className={styles['section-title']}
									style={{ marginBottom: '10px' }}
								>
									{language?.todayExams}
								</h2>
								<ul className={styles['today-exams-list']}>
									{
										queryData.data.todayExams.map(exam => {
											return (
												<li
													key={`exam-${exam.id}`}
													className={css(appStyles['dashboard-card-d'], styles['today-exams-item'])}
												>
													<Link to={`exams/${exam.id}`}>
														<span>{exam.name}</span>
														<span>{new Date(exam.examDate).toLocaleTimeString(appLanguage.language)}</span>
													</Link>
												</li>
											);
										})
									}
								</ul>
							</section>
							<ExamsEachMonthChart
								label={language?.examsEachMonth}
								data={queryData.data.examsEachMonth}
							/>
						</div>
					</>
					: null
			}
		</main >
	);
}
