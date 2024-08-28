import appStyles from '~styles/App.module.css';
import styles from './styles/Dashboard.module.css';

import { useQuery } from '@tanstack/react-query';
import { GrCertificate } from 'react-icons/gr';
import {
    PiChalkboardTeacherLight,
    PiExam,
    PiStudent
} from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { apiGetDashboard } from '~api/dashboard';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import DashboardCard from './components/DashboardCard';
import ExamsEachMonthChart from './components/ExamsEachMonthChart';

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
        <main className={css(appStyles.dashboard, styles.dashboard)}>
            {
                queryData.isLoading ? <Loading /> : null
            }
            {
                !queryData.isError && queryData.data ?
                    <>
                        <section className={styles.wrapDashboardItem}>
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
                        <div className={css(styles.wrapSections)}>
                            <section className={css(styles.section)}>
                                <h2
                                    className={styles.sectionTitle}
                                    style={{ marginBottom: '10px' }}
                                >
                                    {language?.todayExams}
                                </h2>
                                <ul className={styles.todayExamsList}>
                                    {
                                        queryData.data.todayExams.map(exam => {
                                            return (
                                                <li
                                                    key={`exam-${exam.id}`}
                                                    className={css(appStyles.dashboardCard, styles.todayExamsItem)}
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
