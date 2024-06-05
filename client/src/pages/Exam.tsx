import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useState } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { LuAlarmClock, LuRefreshCw } from 'react-icons/lu';
import { Link, useParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import { apiGetExamById, apiUpdateExamStatus } from '../api/exam';
import Loading from '../components/Loading';
import YesNoPopUp from '../components/YesNoPopUp';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/Exam.module.css';
import caculateScore from '../utils/caculateScore';
import css from '../utils/css';
import languageUtils from '../utils/languageUtils';

export default function Exam() {
	const { user, appLanguage, permissions } = useAppContext();
	const [showStartExamPopUp, setShowStartExamPopUp] = useState(false);
	const [showCancelExamPopUp, setShowCancelExamPopUp] = useState(false);
	const language = useLanguage('page.exam');
	const { id } = useParams();
	const handleStartExam = async () => {
		await apiUpdateExamStatus('start', String(id));
	};
	const handleCancelExam = async () => {
		await apiUpdateExamStatus('cancel', String(id));
	};
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.EXAM, { id: id }],
		queryFn: () => apiGetExamById(String(id)),
		refetchOnWindowFocus: false
	});
	const onMutateSuccess = () => { queryData.refetch(); };
	const isSubmitted = queryData.data ?
		queryData.data.result.find(item => item.studentId === user.user!.id)
			?.correctCount !== null
		: false;
	// useEffect(() => {
	// 	const { data } = queryData
	// 	const refetchOffsetMinutes = REFETCH_OFFSET_MINUTES * 60 * 1000
	// 	if (data && !data.cancelledAt && !data.startedAt) {
	// 		const offset = new Date(queryData.data.examDate).getTime() - new Date().getTime()
	// 		if (offset < refetchOffsetMinutes)
	// 			setTimeout(() => {
	// 				queryData.refetch()
	// 				forceUpdate()
	// 			}, 1000)
	// 	}
	// })
	return (
		<>
			{showStartExamPopUp === true ?
				<YesNoPopUp
					message={language?.startMessage || ''}
					mutateFunction={handleStartExam}
					setShowPopUp={setShowStartExamPopUp}
					onMutateSuccess={onMutateSuccess}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			{showCancelExamPopUp === true ?
				<YesNoPopUp
					message={language?.cancelMessage || ''}
					mutateFunction={handleCancelExam}
					setShowPopUp={setShowCancelExamPopUp}
					onMutateSuccess={onMutateSuccess}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			<main className={css(appStyles['dashboard-d'], styles['page-content'])}>
				{
					queryData.isLoading ? <Loading /> : null
				}
				{
					queryData.data ?
						<>
							<section className={styles['exam-info-container']}>
								<div className={styles['header']}>
									<h2 className={styles['title']}>{language?.exam}</h2>
								</div>
								<div className={styles['exam-info']}>
									<div className={styles['group-infos']}>
										<div className={styles['wrap-item']}>
											<label>{language?.name}: </label>
											<p>{queryData.data.name}</p>
										</div>
										<div className={styles['wrap-item']}>
											<label>{language?.examDate}: </label>
											<p>{new Date(queryData.data.examDate).toLocaleString(appLanguage.language)}</p>
										</div>
										<div className={styles['wrap-item']}>
											<label>{language?.examTime}: </label>
											<p>
												{moment.duration(queryData.data.examTime, 'minutes').humanize()}
											</p>
										</div>
										<div className={css(styles['wrap-item'], styles['supervisors-container'])}>
											<label>{language?.supervisors}</label>
											<p>
												{queryData.data.examSupervisors.map(supervisor => {
													return (
														languageUtils.getFullName(supervisor.user.firstName, supervisor.user.lastName)
													);
												}).join(', ')
												}
											</p>
										</div>
									</div>
								</div>
								{
									permissions.hasAnyFormList(['exam_update', 'exam_submit']) ?
										<div className={styles['action-items']}>
											{
												permissions.has('exam_submit')
													&& queryData.data.startedAt !== null
													&& !isSubmitted ?
													<>
														<Link
															style={{ width: 'fit-content' }}
															to='take'
															type='button'
															className={appStyles['action-item-d']}
														>
															<LuAlarmClock />{language?.doExam}
														</Link>
													</> : null
											}
											{
												permissions.has('exam_update') ?
													<>
														{
															permissions.has('exam_update') && queryData.data.startedAt === null ?
																<button
																	onClick={() => {
																		setShowStartExamPopUp(true);
																	}}
																	type='button'
																	className={appStyles['action-item-d']}
																><LuAlarmClock /> {language?.startExam}
																</button>
																: null
														}
														<button
															type='button'
															onClick={() => {
																setShowCancelExamPopUp(true);
															}}
															className={appStyles['action-item-white-border-red-d']}>
															<ImCancelCircle /> {language?.cancelExam}
														</button>
													</> : null
											}
										</div>
										: null
								}
							</section>
							<section className={styles['result-container']}>
								<div className={styles['header']}>
									<h2 className={styles['title']}>{language?.result}</h2>
								</div>
								<div className={appStyles['action-bar-d']}
									style={{ marginBottom: '20px' }}
								>
									<button
										className={
											css(
												queryData.isFetching ? appStyles['button-submitting'] : '',
												queryData.isFetching ? styles['refreshing'] : '',
												appStyles['action-item-d']
											)
										}
										onClick={() => { queryData.refetch(); }}
									>
										<LuRefreshCw />
										{language?.refresh}
									</button>
								</div>
								<div className={styles['table-container']}>
									<table className={styles['table']}>
										<thead>
											<tr>
												<th className={css(styles['column'], styles['super-large'])}>
													{language?.name}
												</th>
												<th className={css(styles['column'], styles['medium'])}>
													{language?.schoolClass}
												</th>
												<th className={css(styles['column'], styles['medium'])}>
													{language?.genders.gender}
												</th>
												<th className={css(styles['column'], styles['medium'])}>
													{language?.score}
												</th>
											</tr>
										</thead>
										<tbody>
											{
												queryData.data.result.map(item => {
													return (
														<tr key={`exam-result-${item.studentId}`}>
															<td className={css(styles['column'], styles['super-large'])}>
																{languageUtils.getFullName(item.firstName, item.lastName)}
															</td>
															<td className={css(styles['column'], styles['medium'])}>
																{item.schoolClassShortcode}
															</td>
															<td className={css(styles['column'], styles['medium'])}>
																{language?.genders[item.gender]}
															</td>
															<td className={css(styles['column'], styles['medium'])}>
																{item.correctCount === null
																	? language?.didNotSubmitted :
																	caculateScore(item.correctCount, item.questionCount)}
															</td>
														</tr>
													);
												})
											}
										</tbody>
									</table>
								</div>
							</section>
						</> : null
				}
			</main>
		</>
	);
}
