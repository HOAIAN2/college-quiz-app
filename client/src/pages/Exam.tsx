import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { apiGetExamById } from '../api/exam'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageExamLang } from '../models/lang'
import styles from '../styles/Exam.module.css'

export default function Exam() {
	const { appLanguage } = useAppContext()
	const language = useLanguage<PageExamLang>('page.exam')
	const { id } = useParams()
	const queryData = useQuery({
		queryKey: [queryKeys.EXAM, { id: id }],
		queryFn: () => apiGetExamById(String(id)),
	})
	return (
		<>
			<div className={
				[
					'dashboard-d',
					styles['page-content']
				].join(' ')
			}>
				{
					queryData.isLoading ? <Loading /> : null
				}
				{
					queryData.data ?
						<>
							<div className={
								[
									styles['form-content']
								].join(' ')
							}>
								<div className={styles['header']}>
									<h2 className={styles['title']}>{queryData.data.name}</h2>
								</div>
								<div
									className={styles['form-data']}>
									<input name='is_active' defaultValue='1' hidden />
									<div className={
										[
											styles['group-inputs']
										].join(' ')
									}>
										<div className={styles['wrap-item']}>
											<label htmlFor='name'>{language?.name}</label>
											<p>{queryData.data.name}</p>
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='name'>{language?.examDate}</label>
											<p>{new Date(queryData.data.examDate).toLocaleString(appLanguage.language)}</p>
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='name'>{language?.examTime}</label>
											<p>
												{moment.duration(queryData.data.examTime, 'minutes').humanize()}
											</p>
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='name'>{'Giám thị'}</label>
											<p>
												{queryData.data.examSupervisors.map(supervisor => {
													return (
														<p>{supervisor.user.firstName}</p>
													)
												})}
											</p>
										</div>
									</div>
									{/* {
										permissions.hasAnyFormList(['semester_update', 'semester_delete']) ?
											<div className={styles['action-items']}>
												{
													permissions.has('semester_update') ?
														<button name='save'
															className={
																[
																	'action-item-d',
																	isPending ? 'button-submitting' : ''
																].join(' ')
															}
														>{language?.save}</button> : null
												}
												{
													permissions.has('semester_delete') ?
														<button
															type='button'
															onClick={() => {
																setShowDeletePopUp(true)
															}}
															className={
																[
																	'action-item-d-white-border-red'
																].join(' ')
															}>
															<MdDeleteOutline /> {language?.delete}
														</button> : null
												}
											</div>
											: null
									} */}
								</div>
							</div>
						</> : null
				}
			</div>
		</>
	)
}
