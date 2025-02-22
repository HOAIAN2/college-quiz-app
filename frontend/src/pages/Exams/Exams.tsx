import appStyles from '~styles/App.module.css';
import styles from '~styles/CardPage.module.css';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router';
import { apiGetExamsByMonth } from '~api/exam';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import { ExamInMonth } from '~models/exam';
import css from '~utils/css';
import timeUtils from '~utils/timeUtils';

export default function Exams() {
    // This state use to trigger re-render each second
    const [, setNow] = useState(new Date().toLocaleString());
    const [searchParams, setSearchParams] = useSearchParams();
    const { appLanguage, permissions, appTitle } = useAppContext();
    const language = useLanguage('page.exams');
    const requestRef = useRef<number>(0);
    const initQueryDate = () => {
        let year = searchParams.get('year');
        let month = searchParams.get('month');
        if (month && month.length == 1) month = '0' + month;
        if (month && year) return `${year}-${month}`;
        year = String(new Date().getFullYear());
        month = new Date().getMonth() + 1 < 10 ?
            '0' + String(new Date().getMonth() + 1) : String(new Date().getMonth() + 1);
        return `${year}-${month}`;
    };
    const animate = useCallback(() => {
        setNow(new Date().toLocaleString());
        requestRef.current = requestAnimationFrame(animate);
    }, []);
    const showExamStatus = (exam: ExamInMonth) => {
        const examDate = new Date(exam.examDate);
        const getClassNames = (color: 'red' | 'green' | 'yellow') => css(styles.badge, styles[color]);
        if (exam.cancelledAt != null) {
            return <div className={getClassNames('red')}>{language?.cancelled}</div>;
        }
        if (timeUtils.isTimeWithinOneHour(examDate)) {
            return (
                <div className={getClassNames('yellow')}>
                    {timeUtils.countDown(examDate)}
                </div>
            );
        }
        if (exam.startedAt == null && new Date().getTime() > examDate.getTime()) {
            return <div className={getClassNames('yellow')}>{language?.pendingStart}</div>;
        }
        if (exam.startedAt != null && timeUtils.isOnTimeExam(new Date(exam.startedAt), exam.examTime)) {
            return <div className={getClassNames('green')}>{language?.inProgress}</div>;
        }
        return examDate.toLocaleString(appLanguage.language);
    };
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.PAGE_EXAMS, {
            month: searchParams.get('month') || '',
            year: searchParams.get('year') || ''
        }],
        queryFn: () => apiGetExamsByMonth({
            month: searchParams.get('month') || '',
            year: searchParams.get('year') || ''
        }),
        enabled: permissions.has('exam_view')
    });
    useEffect(() => {
        if (!queryData.data) return;
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [animate, queryData.data]);
    useEffect(() => {
        if (language) appTitle.setAppTitle(language.exams);
    }, [appTitle, language]);
    if (!permissions.has('exam_view')) return <Navigate to='/' />;
    return (
        <>
            <main className={css(appStyles.dashboard)}>
                {
                    queryData.isLoading ? <Loading /> : null
                }
                <section className={styles.filterForm}>
                    <div className={styles.wrapInputItem}>
                        <label htmlFor='month'>{language?.month}</label>
                        <input
                            defaultValue={initQueryDate()}
                            id='month'
                            name='month'
                            type='month'
                            className={css(appStyles.input, styles.inputItem)}
                            onChange={e => {
                                const date = new Date(e.target.valueAsDate!);
                                searchParams.set('month', String(date.getMonth() + 1));
                                searchParams.set('year', String(date.getFullYear()));
                                setSearchParams(searchParams);
                            }}
                        />
                    </div>
                </section>
                <section className={styles.pageContent}>
                    <div className={styles.wrapCardContainer}>
                        <div className={styles.cardContainer}>
                            {queryData.data ?
                                queryData.data.map(item => {
                                    return (
                                        <Link
                                            key={`exam-${item.id}`}
                                            to={String(item.id)}
                                            className={css(appStyles.dashboardCard, styles.card)}
                                        >
                                            <div className={styles.cardSection}>
                                                <p className={styles.content}>
                                                    {item.name}
                                                </p>
                                            </div>
                                            <div className={styles.cardSection}>
                                                {showExamStatus(item)}
                                            </div>
                                            <div className={styles.cardSection}>
                                                {item.course.subject.name}
                                            </div>
                                        </Link>
                                    );
                                }) : null}
                        </div>
                    </div>
                </section>
            </main >
        </>
    );
}
