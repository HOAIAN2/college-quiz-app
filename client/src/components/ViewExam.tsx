import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { MdDeleteOutline } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import { apiGetExamById, apiUpdateExam } from '../api/exam'
import { apiGetAllUser } from '../api/user'
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { ComponentViewExamLang } from '../models/lang'
import { UserDetail } from '../models/user'
import styles from '../styles/CreateViewExam.module.css'
import createFormUtils from '../utils/createFormUtils'
import languageUtils from '../utils/languageUtils'
import Loading from './Loading'

type ViewExamProps = {
	id: number
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ViewExam({
	id,
	onMutateSuccess,
	setShowPopUp
}: ViewExamProps) {
	const { permissions } = useAppContext()
	const [hide, setHide] = useState(true)
	const [supervisors, setSupervisors] = useState<UserDetail[]>([])
	const [queryUser, setQueryUser] = useState('')
	const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE)
	const language = useLanguage<ComponentViewExamLang>('component.view_exam')
	const queryClient = useQueryClient()
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	const disabledUpdate = !permissions.has('exam_update')
	const formUtils = createFormUtils(styles)
	const queryData = useQuery({
		queryKey: [queryKeys.EXAM, { id: id }],
		queryFn: () => apiGetExamById(id),
	})
	const userQueryData = useQuery({
		queryKey: [queryKeys.ALL_TEACHER, { search: debounceQueryUser }],
		queryFn: () => apiGetAllUser('teacher', debounceQueryUser),
	})
	const handleUpdateExam = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node)?.removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		supervisors.forEach(supervisor => {
			formData.append('supervisor_ids[]', String(supervisor.id))
		})
		await apiUpdateExam(formData, id)
		handleClosePopUp()
	}
	const isExamStarted = () => {
		if (!queryData.data) return false
		if (!queryData.data.startedAt) return false
		const examStartedAt = new Date(queryData.data.startedAt)
		return new Date().getTime() > examStartedAt.getTime()
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateExam,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: onMutateSuccess
	})
	useEffect(() => {
		if (queryData.data) {
			setSupervisors(queryData.data.examSupervisors.map(supervisor => supervisor.user))
		}
	}, [queryData.data])
	useEffect(() => {
		setHide(false)
		return () => {
			queryClient.removeQueries({ queryKey: [queryKeys.EXAM, { id: id }] })
			queryClient.removeQueries({ queryKey: [queryKeys.ALL_TEACHER] })
		}
	}, [id, queryClient])
	return (
		<>
			<div className={
				[
					styles['create-view-exam-container'],
					hide ? styles['hide'] : ''
				].join(' ')
			}>
				{
					queryData.isLoading ? <Loading /> : null
				}
				{
					isPending ? <Loading /> : null
				}
				<div className={
					[
						styles['create-view-exam-form'],
						hide ? styles['hide'] : ''
					].join(' ')
				}>
					<div className={styles['header']}>
						<h2 className={styles['title']}>{language?.exam}</h2>
						<div className={styles['esc-button']}
							onClick={handleClosePopUp}
						>
							<RxCross2 />
						</div>
					</div>
					<div className={
						[
							styles['form-content']
						].join(' ')
					}>
						{
							queryData.data ?
								<form
									onSubmit={e => { mutate(e) }}
									className={styles['form-data']}>
									<div className={
										[
											styles['group-inputs']
										].join(' ')
									}>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='name'>{language?.name}</label>
											<input
												id='name'
												name='name'
												defaultValue={queryData.data.name}
												disabled={disabledUpdate}
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='exam_date'>{language?.examDate}</label>
											<Datetime
												initialValue={new Date(queryData.data.examDate)}
												inputProps={
													{
														id: 'exam_date',
														name: 'exam_date',
														disabled: disabledUpdate,
														className: [
															'input-d',
															styles['input-item']
														].join(' ')
													}
												}
												closeOnSelect={true}
												timeFormat={true}
											/>
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='exam_time'>{language?.examTime}</label>
											<input
												onBeforeInput={(e: React.CompositionEvent<HTMLInputElement>) => {
													if (e.data === '.') e.preventDefault()
												}}
												id='exam_time'
												name='exam_time'
												defaultValue={queryData.data.examTime}
												disabled={disabledUpdate}
												min={0}
												max={60 * 60 * 24}
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												}
												type='number'
											/>
										</div>
										{
											queryData.data ?
												<>
													<div className={styles['wrap-item']}>
														<span>{language?.totalQuestions}: {queryData.data.questionsCount}</span>
													</div>
													<div className={[
														styles['wrap-item'],
														styles['data-container']
													].join(' ')
													}>
														<label>{language?.supervisors}</label>
														<input
															placeholder={language?.search}
															onInput={e => {
																setQueryUser(e.currentTarget.value)
															}}
															className={
																[
																	'input-d',
																	styles['input-item']
																].join(' ')
															} type='text' />
														<label>{language?.joinedSupervisors}</label>
														<ul className={
															[
																styles['joined-supervisors-container']
															].join(' ')
														}>
															{
																supervisors.map((supervisor, index) => {
																	return (
																		<li
																			className={
																				[
																					styles['joined-supervisor']
																				].join(' ')
																			}
																			key={`joined-supervisor-${supervisor.id}`}
																		>
																			<div>
																				<span>
																					{languageUtils.getFullName(supervisor.firstName, supervisor.lastName)}
																				</span>
																				{/* <span>
																			{supervisor.faculty?.name}
																		</span> */}
																				<span
																					style={{ height: '20px' }}
																					onClick={() => {
																						const newSupervisors = structuredClone(supervisors)
																						newSupervisors.splice(index, 1)
																						setSupervisors(newSupervisors)
																					}}
																				>
																					<RxCross2 />
																				</span>
																			</div>
																		</li>
																	)
																})
															}
														</ul>
														<label>{language?.allSupervisors}</label>
														<ul className={styles['all-supervisor-conatiner']}>
															{userQueryData.data ?
																userQueryData.data
																	.filter(user => !supervisors.find(supervisor => supervisor.id === user.id))
																	.map(user => (
																		<li
																			onClick={() => {
																				const newSupervisors = structuredClone(supervisors)
																				newSupervisors.push(user)
																				setSupervisors(newSupervisors)
																			}}
																			className={['dashboard-card-d', styles['card']].join(' ')}
																			key={`user-${user.id}`}
																		>
																			<div className={styles['card-left']}>
																				<span>{languageUtils.getFullName(user.firstName, user.lastName)}</span>
																				<span>{user.faculty?.name}</span>
																			</div>
																		</li>
																	)) : null
															}
														</ul>
													</div>
												</> : null
										}
									</div>
									{
										permissions.hasAnyFormList(['exam_update', 'exam_delete']) && !isExamStarted() ?
											<div className={styles['action-items']}>
												{
													permissions.has('exam_update') && !isExamStarted() ?
														<button name='save'
															className={
																[
																	'action-item-d',
																	isPending ? 'button-submitting' : ''
																].join(' ')
															}
														>{language?.save}
														</button> : null
												}
												{
													permissions.has('exam_delete') && !isExamStarted() ?
														<button
															type='button'
															onClick={() => {
																// setShowDeletePopUp(true)
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
									}
								</form>
								: null
						}
					</div>
				</div>
			</div>
		</>
	)
}
