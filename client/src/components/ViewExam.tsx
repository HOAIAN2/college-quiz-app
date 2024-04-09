import { useMutation, useQuery } from "@tanstack/react-query"
import { SyntheticEvent, useEffect, useState } from "react"
import Datetime from 'react-datetime'
import { MdDeleteOutline } from "react-icons/md"
import { RxCross2 } from "react-icons/rx"
import { apiDeleteExam, apiGetExamById, apiUpdateExam } from "../api/exam"
import { queryKeys } from "../constants/query-keys"
import useAppContext from "../hooks/useAppContext"
import useLanguage from "../hooks/useLanguage"
import { ComponentViewExamLang } from "../models/lang"
import styles from '../styles/global/ViewModel.module.css'
import createFormUtils from "../utils/createFormUtils"
import Loading from "./Loading"
import YesNoPopUp from "./YesNoPopUp"

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
	const [showDeletePopUp, setShowDeletePopUp] = useState(false)
	const [hide, setHide] = useState(true)
	const language = useLanguage<ComponentViewExamLang>('component.view_exam')
	const { permissions } = useAppContext()
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	const formUtils = createFormUtils(styles)
	const queryData = useQuery({
		queryKey: [queryKeys.EXAM, { id: id }],
		queryFn: () => apiGetExamById(id)
	})
	const handleUpdateExam = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node)?.removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiUpdateExam(formData, id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateExam,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: onMutateSuccess
	})
	const handleDeleteExam = async () => {
		await apiDeleteExam(id)
	}
	const isExamOverdue = () => {
		if (!queryData.data) return true
		const examDate = new Date(queryData.data.examDate)
		if (new Date().getTime() > examDate.getTime()) return true
		return false
	}
	const disabledUpdate = !permissions.has('exam_update')
	useEffect(() => {
		setHide(false)
	}, [])
	return (
		<>
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeleteExam}
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
						<h2 className={styles['title']}>{language?.exam}</h2>
						<div className={styles['esc-button']}
							onClick={handleClosePopUp}
						>
							<RxCross2 />
						</div>
					</div>
					{queryData.isLoading ?
						<Loading />
						: null}
					<div className={
						[
							styles['form-content']
						].join(' ')
					}>
						{
							queryData.data ?
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
												disabled={disabledUpdate}
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
												disabled={disabledUpdate}
												defaultValue={queryData.data.examTime}
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
									</div>
									{
										permissions.hasAnyFormList(['exam_update', 'exam_delete']) && !isExamOverdue() ?
											<div className={styles['action-items']}>
												{
													permissions.has('exam_update') && !isExamOverdue() ?
														<button name='save'
															className={
																[
																	'action-item-d',
																	isPending ? 'button-submitting' : ''
																].join(' ')
															}>{language?.save}</button>
														: null
												}
												{
													permissions.has('exam_delete') && !isExamOverdue() ?
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
														: null
												}
											</div> : null
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
