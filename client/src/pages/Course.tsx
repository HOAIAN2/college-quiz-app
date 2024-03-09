import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { LuPenSquare } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import { apiDeleteCourse, apiGetCourseById, apiUpdateCourse } from '../api/course'
import { apiAutoCompleteUser } from '../api/user'
import CustomDataList from '../components/CustomDataList'
import Loading from '../components/Loading'
import UpdateCourseStudents from '../components/UpdateCourseStudents'
import YesNoPopUp from '../components/YesNoPopUp'
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageCourseLang } from '../models/lang'
import styles from '../styles/Course.module.css'
import FormUtils from '../utils/FormUtils'
import languageUtils from '../utils/languageUtils'

export default function Course() {
	const { id } = useParams()
	const { DOM, permissions } = useAppContext()
	const [showDeletePopUp, setShowDeletePopUp] = useState(false)
	const [showUpdateStudentsPopUp, setShowUpdateStudentsPopUp] = useState(false)
	const language = useLanguage<PageCourseLang>('page.course')
	const [queryUser, setQueryUser] = useState('')
	const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE)
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const formUtils = new FormUtils(styles)
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_COURSE, { id: id }],
		queryFn: () => apiGetCourseById(String(id))
	})
	const userQueryData = useQuery({
		queryKey: [queryKeys.AUTO_COMPLETE_SUBJECT, { search: debounceQueryUser }],
		queryFn: () => apiAutoCompleteUser('teacher', debounceQueryUser),
		enabled: debounceQueryUser ? true : false
	})
	const handleUpdateCourse = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		if (!permissions.has('course_update')) return
		document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
			const element = node as HTMLInputElement
			element.classList.remove('error')
			formUtils.getParentElement(element)?.removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		queryData.data && await apiUpdateCourse(formData, queryData.data.id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateCourse,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: () => { queryData.refetch() }
	})
	const handleDeleteCourse = async () => {
		return apiDeleteCourse(String(id))
	}
	const onDeleteCourseSuccess = () => {
		[queryKeys.PAGE_COURSES, queryKeys.PAGE_DASHBOARD].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] })
		})
		navigate('/semesters')
	}
	useEffect(() => {
		return () => {
			queryClient.removeQueries({ queryKey: [queryKeys.PAGE_COURSE, { id: id }] })
		}
	}, [id, queryClient])
	useEffect(() => {
		if (queryData.data && DOM.titleRef.current) {
			document.title = queryData.data.name
			DOM.titleRef.current.textContent = document.title
		}
	}, [DOM.titleRef, queryData.data])
	return (
		<>
			{showUpdateStudentsPopUp && queryData.data ?
				<UpdateCourseStudents
					courseDetail={queryData.data}
					setShowPopUp={setShowUpdateStudentsPopUp}
					onMutateSuccess={() => { queryData.refetch() }}
				/> : null
			}
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeleteCourse}
					setShowPopUp={setShowDeletePopUp}
					onMutateSuccess={onDeleteCourseSuccess}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
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
								<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
									mutate(e)
								}}
									onInput={e => { formUtils.handleOnInput(e) }}
									className={styles['form-data']}>
									<input name='is_active' defaultValue='1' hidden />
									<div className={
										[
											styles['group-inputs']
										].join(' ')
									}>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
											<input
												id='shortcode'
												disabled={!permissions.has('course_update')}
												defaultValue={queryData.data.shortcode}
												name='shortcode'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='name'>{language?.name}</label>
											<input
												id='name'
												disabled={!permissions.has('course_update')}
												defaultValue={queryData.data.name}
												name='name'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='teacher_id'>{language?.teacher}</label>
											<CustomDataList
												name='teacher_id'
												onInput={e => { setQueryUser(e.currentTarget.value) }}
												disabled={!permissions.has('course_update')}
												defaultOption={
													{
														label: languageUtils.getFullName(queryData.data.teacher.firstName, queryData.data.teacher.lastName),
														value: queryData.data ? String(queryData.data.teacherId) : ''
													}
												}
												options={userQueryData.data ? userQueryData.data.map(item => {
													return {
														label: languageUtils.getFullName(item.firstName, item.lastName),
														value: String(item.id)
													}
												}) : []}
												className={
													[
														styles['custom-select']
													].join(' ')
												}
											/>
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']}>{language?.subject}</label>
											<input
												disabled
												defaultValue={queryData.data.subject.name}
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
									</div>
									{
										permissions.has('course_update') || permissions.has('course_delete') ?
											<div className={styles['action-items']}>
												{
													permissions.has('course_update') ?
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
													permissions.has('course_delete') ?
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
									}
								</form>
							</div>
							<div className={styles['header']}>
								<h2 className={styles['title']}>{language?.studentList}</h2>
							</div>
							{
								permissions.has('course_update') ?
									<div className={
										[
											'action-bar-d'
										].join(' ')
									}
										style={{ paddingLeft: '20px' }}
									>
										<button
											className={
												[
													'action-item-d',
													styles['edit-students-button']
												].join(' ')
											}
											onClick={() => {
												setShowUpdateStudentsPopUp(true)
											}}
										>
											<LuPenSquare />
											<span>
												{language?.edit}
											</span>
										</button>
									</div>
									: null
							}
							<div className={styles['enrollments-container']}>
								{
									queryData.data.enrollments
										.map(enrollment => {
											const fullName = languageUtils.getFullName(enrollment.user.firstName, enrollment.user.lastName)
											const schoolClass = enrollment.user.schoolClass?.shortcode
											return (
												<div
													title={[fullName, schoolClass].join(' ')}
													key={`enrollment-${enrollment.id}`}
													className={
														[
															'dashboard-card-d',
															styles['card'],
														].join(' ')
													}
												>
													<div className={styles['card-content']}>
														{[fullName, `(${schoolClass})`].join(' ')}
													</div>
												</div>
											)
										})
								}
							</div>
						</>
						: null
				}
			</div>
		</>
	)
}
