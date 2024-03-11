import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { RiAddFill } from 'react-icons/ri'
import { RxCross2 } from 'react-icons/rx'
import { toast } from 'sonner'
import { apiDeleteQuestion, apiGetQuestionById, apiUpdateQuestion } from '../api/question'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ComponentViewQuestionLang } from '../models/lang'
import { SubjectDetail } from '../models/subject'
import styles from '../styles/CreateQuestion.module.css'
import globalStyles from '../styles/global/ViewModel.module.css'
import { autoSizeTextArea } from '../utils/autoSizeTextArea'
import createFormUtils from '../utils/createFormUtils'
import CustomSelect from './CustomSelect'
import Loading from './Loading'
import YesNoPopUp from './YesNoPopUp'

type ViewQuestionProps = {
	id: number
	subjectDetail: SubjectDetail
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

type Option = {
	key: string,
	content: string
}

export default function ViewQuestion({
	id,
	subjectDetail,
	onMutateSuccess,
	setShowPopUp
}: ViewQuestionProps) {
	const { permissions } = useAppContext()
	const [hide, setHide] = useState(true)
	const [options, setOptions] = useState<Option[]>([])
	const [showDeletePopUp, setShowDeletePopUp] = useState(false)
	const [trueOptionKey, setTrueOptionKey] = useState<string>()
	const language = useLanguage<ComponentViewQuestionLang>('component.view_question')
	const queryClient = useQueryClient()
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	const formUtils = createFormUtils(globalStyles)
	const disabledUpdate = !permissions.has('question_update')
	const queryData = useQuery({
		queryKey: [queryKeys.QUESTION_DETAIL, { id: id }],
		queryFn: () => apiGetQuestionById(id)
	})
	const handleUpdateQuestion = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(styles['form-data'])?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node)?.removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiUpdateQuestion(formData, id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateQuestion,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: onMutateSuccess
	})
	const handleDeleteQuestion = async () => {
		return apiDeleteQuestion(id)
	}
	useEffect(() => {
		setHide(false)
		const handleEscEvent = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && document.activeElement?.nodeName !== 'INPUT') handleClosePopUp()
		}
		document.addEventListener('keydown', handleEscEvent)
		return () => {
			queryClient.removeQueries({ queryKey: [queryKeys.QUESTION_DETAIL, { id: id }] })
			document.removeEventListener('keydown', handleEscEvent)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])
	useEffect(() => {
		if (queryData.data) {
			const questionOptions = queryData.data.questionOptions.map(item => {
				return {
					key: item.id.toString(),
					content: item.content,
					isCorrect: item.isCorrect
				}
			})
			setOptions(questionOptions.map(item => {
				return {
					key: item.key,
					content: item.content
				}
			}))
			setTrueOptionKey(questionOptions.find(item => item.isCorrect)?.key)
		}
	}, [queryData.data])
	return (
		<>
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeleteQuestion}
					setShowPopUp={setShowDeletePopUp}
					onMutateSuccess={() => { onMutateSuccess(); handleClosePopUp() }}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			<div
				className={
					[
						globalStyles['view-model-container'],
						hide ? globalStyles['hide'] : ''
					].join(' ')
				}>
				{
					isPending ? <Loading /> : null
				}
				<div
					className={
						[
							globalStyles['view-model-form'],
							hide ? globalStyles['hide'] : ''
						].join(' ')
					}>
					<div className={globalStyles['header']}>
						<h2 className={globalStyles['title']}>{language?.title}</h2>
						<div className={globalStyles['esc-button']}
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
								globalStyles['form-content']
							].join(' ')
						}>
							{
								queryData.data ? (
									<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
										mutate(e)
									}}
										onInput={(e) => { formUtils.handleOnInput(e) }}
										className={globalStyles['form-data']}>
										<input name='true_option' readOnly hidden value={options.findIndex(option => option.key === trueOptionKey)} />
										<input name='subject_id' readOnly hidden value={subjectDetail.id} />
										<div className={
											[
												globalStyles['group-inputs']
											].join(' ')
										}>
											<div style={{ zIndex: 2 }} className={globalStyles['wrap-item']}>
												<label htmlFor='chapter_id'>{language?.chapter}</label>
												<CustomSelect
													name='chapter_id'
													disabled={disabledUpdate}
													defaultOption={(() => {
														const chapter = subjectDetail.chapters.find(item => item.id == queryData.data.chapterId)
														return {
															label: chapter?.name || language?.unselect,
															value: String(chapter?.id || '')
														}
													})()
													}
													options={
														[
															{
																label: language?.unselect,
																value: ''
															},
															...subjectDetail.chapters.map(chapter => ({
																value: String(chapter.id),
																label: `${chapter.chapterNumber}. ${chapter.name}`
															}))]
													}
													className={
														[
															globalStyles['custom-select']
														].join(' ')
													}
												/>
											</div>
											<div className={globalStyles['wrap-item']}>
												<label className={globalStyles['required']} htmlFor="">{language?.level}</label>
												<CustomSelect
													name='level'
													disabled={disabledUpdate}
													defaultOption={
														{
															label: language?.questionLevel[queryData.data.level],
															value: queryData.data.level
														}
													}
													options={language ?
														Object.keys(language.questionLevel).map(item => {
															return {
																value: item,
																label: language.questionLevel[item as keyof typeof language.questionLevel]
															}
														}) : []
													}
													className={
														[
															globalStyles['custom-select']
														].join(' ')
													}
												/>
											</div>
											<div className={
												[
													globalStyles['wrap-item'],
													globalStyles['textarea']
												].join(' ')
											}>
												<label className={globalStyles['required']} htmlFor='content'>{language?.content}</label>
												<textarea
													disabled={disabledUpdate}
													defaultValue={queryData.data.content}
													onInput={autoSizeTextArea}
													name='content' id='content'
													className={
														[
															'input-d',
															globalStyles['input-item'],
														].join(' ')
													}
													cols={30} rows={50}>
												</textarea>
											</div>
											{
												permissions.has('question_update') ?
													<div
														style={{ paddingLeft: '20px' }}
														className={
															[
																'action-bar-d'
															].join(' ')
														}>
														{
															<div
																style={{ width: 'fit-content' }}
																className={
																	[
																		'action-item-d'
																	].join(' ')
																}
																onClick={() => {
																	setOptions([
																		...options,
																		{
																			key: crypto.randomUUID(),
																			content: ''
																		}
																	])
																}}
															>
																<RiAddFill /> {language?.addOption}
															</div>
														}
													</div> : null
											}
										</div>
										<div className={globalStyles['group-inputs']}>
											{options.map((option, index) => {
												return (
													<div
														key={option.key}
														className={
															[
																styles['textarea-group'],
																globalStyles['wrap-item'],
																globalStyles['textarea'],
															].join(' ')
														}>
														<div className={
															[
																styles['wrap-label'],
															].join(' ')
														}>
															<label style={{ cursor: 'pointer' }}
																className={globalStyles['required']}
																onClick={() => {
																	setTrueOptionKey(String(option.key))
																}}
															>{`${language?.answer} ${index + 1}`}</label>
															{
																option.key === trueOptionKey ?
																	<FaRegCircleCheck />
																	: null
															}
														</div>
														<textarea
															defaultValue={option.content}
															data-selector={`options.${index}`}
															onInput={autoSizeTextArea}
															name='options[]'
															disabled={disabledUpdate}
															className={
																[
																	'input-d',
																	globalStyles['input-item'],
																	styles['textarea'],
																].join(' ')
															}
															cols={30} rows={50}>
														</textarea>
														{
															permissions.has('question_update') ?
																<div
																	onClick={() => {
																		if (options.length == 2) {
																			toast.error(language?.deleteOptionError)
																		}
																		else setOptions(options.filter(item => item.key !== option.key))
																	}}
																	className={
																		[
																			'action-item-d-white-border-red'
																		].join(' ')
																	}>
																	<MdDeleteOutline /> {language?.delete}
																</div> : null
														}
													</div>
												)
											})}
										</div>
										{
											permissions.hasAnyFormList(['question_update', 'question_delete']) ?
												<div className={globalStyles['action-items']}>
													<button name='save'
														className={
															[
																'action-item-d',
																isPending ? 'button-submitting' : ''
															].join(' ')
														}>{language?.save}</button>
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
												</div> : null
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
