import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { RxCross2 } from 'react-icons/rx'
import { apiCreateExam } from '../api/exam'
import { apiGetSubjectById } from '../api/subject'
import { queryKeys } from '../constants/query-keys'
import useLanguage from '../hooks/useLanguage'
import { CourseDetail } from '../models/course'
import { ComponentCreateExamLang } from '../models/lang'
import styles from '../styles/CreateExam.module.css'
import createFormUtils from '../utils/createFormUtils'
import Loading from './Loading'

type CreateExamProps = {
	courseDetail: CourseDetail
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateExam({
	courseDetail,
	onMutateSuccess,
	setShowPopUp
}: CreateExamProps) {
	const [hide, setHide] = useState(true)
	const [totalQuestion, setTotalQuestion] = useState(0)
	const language = useLanguage<ComponentCreateExamLang>('component.create_exam')
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
		queryKey: [queryKeys.PAGE_SUBJECT, { id: courseDetail.subjectId }],
		queryFn: () => apiGetSubjectById(courseDetail.subjectId)
	})
	const handleCreateExam = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node)?.removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		// chapterIds.forEach(chapterId => {
		// 	formData.append('chapter_ids[]', String(chapterId))
		// })
		await apiCreateExam(formData)
		handleClosePopUp()
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleCreateExam,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: onMutateSuccess
	})
	useEffect(() => {
		setHide(false)
	}, [])
	return (
		<>
			<div className={
				[
					styles['create-exam-container'],
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
						styles['create-exam-form'],
						hide ? styles['hide'] : ''
					].join(' ')
				}>
					<div className={styles['header']}>
						<h2 className={styles['title']}>{language?.create}</h2>
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
						<form
							onSubmit={e => { mutate(e) }}
							className={styles['form-data']}>
							<input hidden readOnly name='course_id' value={courseDetail.id} />
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
										initialValue={new Date()}
										inputProps={
											{
												id: 'exam_date',
												name: 'exam_date',
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
											<ul className={styles['question-count-container']}>
												{queryData.data.chapters.sort((a, b) =>
													a.chapterNumber - b.chapterNumber
												).map(chapter => {
													const key = `chapter-${chapter.id}`
													return (
														<li
															className={styles['wrap-item']}
															key={key}
														>
															<label htmlFor={key}>{`${chapter.chapterNumber}. ${chapter.name}`}</label>
															<input
																id={key}
																onInput={() => {
																	const total = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="question_counts[]"]'))
																		.reduce((total, current) => {
																			return current.valueAsNumber ? total += current.valueAsNumber : total
																		}, 0)
																	setTotalQuestion(total)
																}}
																name='question_counts[]'
																onBeforeInput={(e: React.CompositionEvent<HTMLInputElement>) => {
																	if (e.data === '.') e.preventDefault()
																}}
																className={
																	[
																		'input-d',
																		styles['input-item']
																	].join(' ')
																}
																type='number'
																min={0}
															/>
														</li>
													)
												})}
											</ul>
											<div className={styles['wrap-item']}>
												<span>{language?.totalQuestions}: {totalQuestion}</span>
											</div>
										</> : null
								}
							</div>
							<div className={styles['action-items']}>
								<button name='save'
									className={
										[
											'action-item-d',
											isPending ? 'button-submitting' : ''
										].join(' ')
									}>{language?.save}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}
