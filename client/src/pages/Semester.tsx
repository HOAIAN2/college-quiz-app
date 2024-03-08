import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { MdDeleteOutline } from 'react-icons/md'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiDeleteSemester, apiGetSemesterById, apiUpdateSemester } from '../api/semester'
import Loading from '../components/Loading'
import YesNoPopUp from '../components/YesNoPopUp'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageSemesterLang } from '../models/lang'
import styles from '../styles/Semester.module.css'
import FormUtils from '../utils/FormUtils'

export default function Semester() {
	const { permissions } = useAppContext()
	const [showDeletePopUp, setShowDeletePopUp] = useState(false)
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const language = useLanguage<PageSemesterLang>('page.semester')
	const { id } = useParams()
	const formUtils = new FormUtils(styles)
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_SEMESTER, { id: id }],
		queryFn: () => apiGetSemesterById(String(id))
	})
	const handleUpdateSemester = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(styles['form-data'])?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node)?.removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiUpdateSemester(formData, String(id))
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateSemester,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: () => { }
	})
	const handleDeleteSemester = async () => {
		return apiDeleteSemester(String(id))
	}
	const onMutateSuccess = () => {
		[queryKeys.PAGE_SEMESTERS].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] })
		})
		navigate('/semesters')
	}
	useEffect(() => {
		return () => {
			queryClient.removeQueries({ queryKey: [queryKeys.PAGE_SEMESTER, { id: id }] })
		}
	}, [id, queryClient])
	return (
		<>
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeleteSemester}
					setShowPopUp={setShowDeletePopUp}
					onMutateSuccess={onMutateSuccess}
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
					isPending ? <Loading /> : null
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
											<label className={styles['required']} htmlFor='name'>{language?.name}</label>
											<input
												id='name'
												name='name'
												disabled={!permissions.has('semester_update')}
												defaultValue={queryData.data.name}
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='start_date'>{language?.startDate}</label>
											<Datetime
												initialValue={new Date(queryData.data.startDate)}
												inputProps={
													{
														id: 'start_date',
														name: 'start_date',
														className: [
															'input-d',
															styles['input-item']
														].join(' '),
														disabled: !permissions.has('semester_update')
													}
												}
												closeOnSelect={true}
												timeFormat={false}
											/>
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='end_date'>{language?.endDate}</label>
											<Datetime
												initialValue={new Date(queryData.data.endDate)}
												inputProps={
													{
														id: 'end_date',
														name: 'end_date',
														className: [
															'input-d',
															styles['input-item']
														].join(' '),
														disabled: !permissions.has('semester_update')
													}
												}
												closeOnSelect={true}
												timeFormat={false}
											/>
										</div>
									</div>

									{
										permissions.has('semester_update') || permissions.has('semester_delete') ?
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
									}
								</form>
							</div>
							{
								permissions.has('course_view') ?
									<Link
										to={'courses'}
										state={queryData.data}
										className={styles['header']}>
										<h2 className={styles['title']}>
											{language?.courses}
										</h2>
									</Link>
									: null
							}
						</> : null
				}
			</div >
		</>
	)
}
