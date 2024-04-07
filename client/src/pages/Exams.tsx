import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiGetUpcommingExams } from '../api/exam'
import CustomSelect from '../components/CustomSelect'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageExamsLang } from '../models/lang'
import styles from '../styles/global/CardPage.module.css'
import { countDown } from '../utils/countDown'

export default function Exams() {
	const [currentDateTime, setCurrentDateTime] = useState(new Date())
	const [searchParams, setSearchParams] = useSearchParams()
	const { appLanguage } = useAppContext()
	const language = useLanguage<PageExamsLang>('page.exams')
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_EXAMS, {
			step: searchParams.get('step')
		}],
		queryFn: () => apiGetUpcommingExams({
			step: searchParams.get('step') || 'week'
		})
	})
	const isTimeWithinOneHour = (dateTime: Date) => {
		const oneHourMiliSeconds = 60 * 60 * 1000
		const offset = dateTime.getTime() - currentDateTime.getTime()
		return offset > 0 && offset < oneHourMiliSeconds
	}
	const isOnTimeExam = (examDate: Date, examTime: number) => {
		const examEndTime = examDate.getTime() + examTime * 60 * 1000
		return examDate.getTime() < currentDateTime.getTime()
			&& currentDateTime.getTime() < examEndTime
	}
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentDateTime(new Date())
		}, 1000)
		return () => clearInterval(interval)
	}, [])
	return (
		<>
			<div
				className={
					[
						'dashboard-d'
					].join(' ')
				}
			>
				<div className={styles['page-content']}>
					{queryData.isLoading ?
						<Loading />
						: null}
					<div className={styles['filter-form']}>
						<div className={styles['wrap-input-item']}>
							{/* <label htmlFor="">{'language?.filter.search'}</label> */}
							<CustomSelect
								defaultOption={
									{
										label: searchParams.get('step') === 'week' ? language?.upComingWeek : language?.upComingMonth,
										value: searchParams.get('step') || 'week'
									}
								}
								options={[
									{
										label: language?.upComingMonth,
										value: 'month'
									},
									{
										label: language?.upComingWeek,
										value: 'week'
									},
								]}
								onChange={(option) => {
									searchParams.set('step', option.value)
									setSearchParams(searchParams)
								}}
								className={
									[
										styles['custom-select']
									].join(' ')
								}
							/>
						</div>
					</div>
					<div className={styles['wrap-card-container']}>
						<div className={styles['card-container']}>
							{queryData.data ?
								queryData.data.map(item => {
									return (
										<div
											key={`exam-${item.id}`}
											// to={String(item.id)}
											className={
												[
													'dashboard-card-d',
													styles['card'],
												].join(' ')
											}>
											<div className={styles['card-section']}>
												<p className={styles['content']}>
													{item.name}
												</p>
											</div>
											<div className={styles['card-section']}>
												{
													isTimeWithinOneHour(new Date(item.examDate)) ?
														<div className={
															[
																styles['badge'],
																styles['yellow']
															].join(' ')
														}>
															{countDown(new Date(item.examDate))}
														</div>
														:
														isOnTimeExam(new Date(item.examDate), item.examTime) ?
															<div className={
																[
																	styles['badge'],
																	styles['green']
																].join(' ')
															}>
																{language?.inProgress}
															</div>
															: new Date(item.examDate).toLocaleString(appLanguage.language)
												}
											</div>
											<div className={styles['card-section']}>
												{item.course.subject.name}
											</div>
										</div>
									)
								}) : null}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
