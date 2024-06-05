import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useCallback, useEffect, useRef } from 'react';
import Datetime from 'react-datetime';
import { Link, useSearchParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import { apiGetExamsByMonth } from '../api/exam';
import Loading from '../components/Loading';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useForceUpdate from '../hooks/useForceUpdate';
import useLanguage from '../hooks/useLanguage';
import { ExamInMonth } from '../models/exam';
import styles from '../styles/global/CardPage.module.css';
import css from '../utils/css';
import renderMonth from '../utils/renderMonth';
import timeUtils from '../utils/timeUtils';

export default function Exams() {
	const forceUpdate = useForceUpdate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { appLanguage } = useAppContext();
	const language = useLanguage('page.exams');
	const requestRef = useRef<number>();
	const monthYearFormat = moment.localeData()
		.longDateFormat('L')
		.replace(/D[\\/\-\\.]?/g, '')
		.trim();
	const initQueryDate = () => {
		const year = searchParams.get('year');
		const month = searchParams.get('month');
		if (month && year) return new Date(Number(year), Number(month) - 1);
		return new Date();
	};
	const animate = useCallback(() => {
		forceUpdate();
		requestRef.current = requestAnimationFrame(animate);
	}, [forceUpdate]);
	const showExamStatus = (exam: ExamInMonth) => {
		const examDate = new Date(exam.examDate);
		const getClassNames = (color: string) => css(styles['badge'], styles[color]);
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
		})
	});
	useEffect(() => {
		if (!queryData.data) return;
		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current!);
	}, [animate, queryData.data]);
	return (
		<>
			<main className={css(styles['page-content'], appStyles['dashboard-d'])}>
				{
					queryData.isLoading ? <Loading /> : null
				}
				<section className={styles['filter-form']}>
					<div className={styles['wrap-input-item']}>
						<label htmlFor='month'>{language?.month}</label>
						<Datetime
							renderMonth={renderMonth}
							locale={appLanguage.language}
							initialValue={initQueryDate()}
							inputProps={
								{
									id: 'month',
									name: 'month',
									className: css(appStyles['input-d'], styles['input-item'])
								}
							}
							onChange={e => {
								const date = new Date(e.toString());
								searchParams.set('month', String(date.getMonth() + 1));
								searchParams.set('year', String(date.getFullYear()));
								setSearchParams(searchParams);
							}}
							closeOnSelect={true}
							dateFormat={monthYearFormat}
							timeFormat={false}
						/>
					</div>
				</section>
				<section className={styles['wrap-card-container']}>
					<div className={styles['card-container']}>
						{queryData.data ?
							queryData.data.map(item => {
								return (
									<Link
										key={`exam-${item.id}`}
										to={String(item.id)}
										className={css(appStyles['dashboard-card-d'], styles['card'])}
									>
										<div className={styles['card-section']}>
											<p className={styles['content']}>
												{item.name}
											</p>
										</div>
										<div className={styles['card-section']}>
											{showExamStatus(item)}
										</div>
										<div className={styles['card-section']}>
											{item.course.subject.name}
										</div>
									</Link>
								);
							}) : null}
					</div>
				</section>
			</main >
		</>
	);
}
