import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { MdDeleteOutline } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import { apiDeleteSemester, apiGetSemesterById, apiUpdateSemester } from '../api/semester'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ComponentViewSemesterLang } from '../models/lang'
import styles from '../styles/global/ViewModel.module.css'
import FormUtils from '../utils/FormUtils'
import Loading from './Loading'
import YesNoPopUp from './YesNoPopUp'

type ViewSemesterProps = {
	id: number | string
	onMutateSuccess: () => void
	setShowPopup: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ViewSemester({
	id,
	onMutateSuccess,
	setShowPopup
}: ViewSemesterProps) {
	const [hide, setHide] = useState(true)
	const { permissions } = useAppContext()
	const [showDeletePopUp, setShowDeletePopUp] = useState(false)
	const queryClient = useQueryClient()
	const language = useLanguage<ComponentViewSemesterLang>('component.view_semester')
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopup(false)
		}, timing)
	}
	const formUtils = new FormUtils(styles)
	const queryData = useQuery({
		queryKey: [queryKeys.SEMESTER_DETAIL, { id: id }],
		queryFn: () => apiGetSemesterById(id)
	})
	const handleUpdateSemester = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(styles['form-data'])?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node)?.removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiUpdateSemester(formData, id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateSemester,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: onMutateSuccess
	})
	const handleDeleteSemester = async () => {
		return apiDeleteSemester(id)
	}
	useEffect(() => {
		setHide(false)
		const handleEscEvent = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && document.activeElement?.nodeName !== 'INPUT') handleClosePopUp()
		}
		document.addEventListener('keydown', handleEscEvent)
		return () => {
			document.removeEventListener('keydown', handleClosePopUp)
			queryClient.removeQueries({ queryKey: [queryKeys.SEMESTER_DETAIL, { id: id }] })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<>
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeleteSemester}
					setShowPopUp={setShowDeletePopUp}
					onMutateSuccess={() => { onMutateSuccess(); handleClosePopUp() }}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			<div
				className={
					[
						styles['view-model-container'],
						hide ? styles['hide'] : ''
					].join(' ')
				}>
				{
					isPending ? <Loading /> : null
				}
				<div
					className={
						[
							styles['view-model-form'],
							hide ? styles['hide'] : ''
						].join(' ')
					}>
					<div className={styles['header']}>
						<h2 className={styles['title']}>{queryData.data?.name}</h2>
						<div className={styles['esc-button']}
							onClick={handleClosePopUp}
						>
							<RxCross2 />
						</div>
					</div>
					<>
						{queryData.isLoading ?
							<Loading />
							: null}
						<div className={
							[
								styles['form-content']
							].join(' ')
						}>
							{
								queryData.data ? (
									<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
										mutate(e)
									}}
										onInput={(e) => { formUtils.handleOnInput(e) }}
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
															].join(' ')
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
															].join(' ')
														}
													}
													closeOnSelect={true}
													timeFormat={false}
												/>
											</div>
										</div>
										{
											permissions.has('user_update') ?
												<div className={styles['action-items']}>
													<button name='save'
														className={
															[
																'action-item-d',
																isPending ? 'button-submitting' : ''
															].join(' ')
														}
													>{language?.save}</button>
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
													</button>
												</div>
												: null
										}
									</form>
								) : null
							}
						</div>
					</>
				</div>
			</div>
		</>
	)
}
