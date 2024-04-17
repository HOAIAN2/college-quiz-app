import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import 'moment/dist/locale/vi'
import { useEffect } from 'react'
import Datetime from 'react-datetime'
import { Link, useSearchParams } from 'react-router-dom'
import { apiGetExamsByMonth } from '../api/exam'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useForceUpdate from '../hooks/useForceUpdate'
import useLanguage from '../hooks/useLanguage'
import { PageExamsLang } from '../models/lang'
import styles from '../styles/global/CardPage.module.css'
import renderMonth from '../utils/renderMonth'
import timeUtils from '../utils/timeUtils'

export default function Exams() {
	const forceUpdate = useForceUpdate()
	const [searchParams, setSearchParams] = useSearchParams()
	const { appLanguage } = useAppContext()
	const language = useLanguage<PageExamsLang>('page.exams')
	const monthYearFormat = moment.localeData()
		.longDateFormat('L')
		.replace(/D[\\/\-\\.]?/g, '')
		.trim()
	const initQueryDate = () => {
		const year = searchParams.get('year')
		const month = searchParams.get('month')
		if (month && year) return new Date(Number(year), Number(month) - 1)
		return new Date()
	}
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_EXAMS, {
			month: searchParams.get('month') || '',
			year: searchParams.get('year') || ''
		}],
		queryFn: () => apiGetExamsByMonth({
			month: searchParams.get('month') || '',
			year: searchParams.get('year') || ''
		})
	})
	useEffect(() => {
		const interval = setInterval(() => {
			forceUpdate()
		}, 1000)
		return () => clearInterval(interval)
	}, [forceUpdate])
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
							<label htmlFor="month">{language?.month}</label>
							<Datetime
								renderMonth={renderMonth}
								locale={appLanguage.language}
								initialValue={initQueryDate()}
								inputProps={
									{
										id: 'month',
										name: 'month',
										className: [
											'input-d',
											styles['input-item']
										].join(' ')
									}
								}
								onChange={e => {
									const date = new Date(e.toString())
									searchParams.set('month', String(date.getMonth() + 1))
									searchParams.set('year', String(date.getFullYear()))
									setSearchParams(searchParams)
								}}
								closeOnSelect={true}
								dateFormat={monthYearFormat}
								timeFormat={false}
							/>
						</div>
					</div>
					<div className={styles['wrap-card-container']}>
						<div className={styles['card-container']}>
							{queryData.data ?
								queryData.data.map(item => {
									return (
										<Link
											key={`exam-${item.id}`}
											to={String(item.id)}
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
													timeUtils.isTimeWithinOneHour(new Date(item.examDate)) ?
														<div className={
															[
																styles['badge'],
																styles['yellow']
															].join(' ')
														}>
															{timeUtils.countDown(new Date(item.examDate))}
														</div>
														:
														timeUtils.isOnTimeExam(new Date(item.examDate), item.examTime) ?
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
										</Link>
									)
								}) : null}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
