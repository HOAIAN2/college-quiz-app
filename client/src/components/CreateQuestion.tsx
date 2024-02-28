import { useMutation } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md'
import { RiAddFill } from 'react-icons/ri'
import { RxCross2 } from 'react-icons/rx'
import { apiCreateQuestion } from '../api/question'
import useLanguage from '../hooks/useLanguage'
import { ComponentCreateQuestionLang } from '../models/lang'
import { SubjectDetail } from '../models/subject'
import styles from '../styles/CreateQuestion.module.css'
import globalStyles from '../styles/global/CreateModel.module.css'
import FormUtils from '../utils/FormUtils'
import { autoSizeTextArea } from '../utils/autoSizeTextArea'
import CustomSelect from './CustomSelect'
import Loading from './Loading'

type CreateQuestionProps = {
	subjectDetail: SubjectDetail
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

type Option = {
	key: string,
	content: string
}

export default function CreateQuestion({
	subjectDetail,
	onMutateSuccess,
	setShowPopUp
}: CreateQuestionProps) {
	const [hide, setHide] = useState(true)
	const [options, setOptions] = useState<Option[]>([])
	const [trueOptionKey, setTrueOptionKey] = useState<string>()
	const language = useLanguage<ComponentCreateQuestionLang>('component.create_question')
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	const formUtils = new FormUtils(globalStyles)
	const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
		const element = e.target as HTMLInputElement
		if (element) {
			element.classList.remove('error')
			formUtils.getParentElement(element).removeAttribute('data-error')
		}
	}
	const handleCreateQuestion = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(globalStyles['form-data'])?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node).removeAttribute('data-error')
		})
		const submitter = e.nativeEvent.submitter as HTMLButtonElement
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiCreateQuestion(formData)
		if (submitter.name === 'save') handleClosePopUp()
		else form.reset()
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleCreateQuestion,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: onMutateSuccess
	})
	useEffect(() => {
		setHide(false)
		const handleEscEvent = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && document.activeElement?.nodeName !== 'INPUT') handleClosePopUp()
		}
		document.addEventListener('keydown', handleEscEvent)
		return () => {
			document.removeEventListener('keydown', handleEscEvent)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<div className={
			[
				globalStyles['create-model-container'],
				hide ? globalStyles['hide'] : ''
			].join(' ')
		}>
			{
				isPending ? <Loading /> : null
			}
			<div className={
				[
					globalStyles['create-model-form'],
					hide ? globalStyles['hide'] : ''
				].join(' ')
			}>
				<div className={globalStyles['header']}>
					<h2 className={globalStyles['title']}>{language?.create}</h2>
					<div className={globalStyles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<div className={
					[
						globalStyles['form-content']
					].join(' ')
				}>
					<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
						mutate(e)
					}}
						onInput={handleOnInput}
						className={globalStyles['form-data']}>
						<input name='true_option' readOnly hidden value={options.findIndex(option => option.key === trueOptionKey)} />
						<input name='subject_id' readOnly hidden value={subjectDetail.id} />
						<div className={
							[
								globalStyles['group-inputs']
							].join(' ')
						}>
							<div className={globalStyles['wrap-item']}>
								<label htmlFor="">{language?.chapter}</label>
								<CustomSelect
									name='chapter_id'
									defaultOption={
										{
											label: language?.unselect,
											value: ''
										}
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
									onChange={(option) => {
										console.log(option)
									}}
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
									defaultOption={
										{
											label: language?.questionLevel.easy,
											value: 'easy'
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
									// onChange={(option) => {
									// 	console.log(option)
									// }}
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
													key: new Date().getTime().toString(),
													content: ''
												}
											])
										}}
									>
										<RiAddFill /> {language?.addOption}
									</div>
								}
							</div>
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
										<label style={{ cursor: 'pointer' }}
											className={globalStyles['required']}
											onClick={() => {
												setTrueOptionKey(String(option.key))
											}}
										>{`${language?.answer} ${index + 1}`}</label>
										<textarea
											onInput={autoSizeTextArea}
											name='options[]'
											className={
												[
													'input-d',
													globalStyles['input-item'],
													styles['textarea'],
													option.key === trueOptionKey ? styles['active'] : ''
												].join(' ')
											}
											cols={30} rows={50}>
										</textarea>
										<div
											onClick={() => {
												setOptions(options.filter(item => item.key !== option.key))
											}}
											className={
												[
													'action-item-d-white-border-red'
												].join(' ')
											}>
											<MdDeleteOutline /> {language?.delete}
										</div>
									</div>
								)
							})}
						</div>
						<div className={globalStyles['action-items']}>
							<button name='save'
								className={
									[
										'action-item-d',
										isPending ? 'button-submitting' : ''
									].join(' ')
								}>{language?.save}</button>
							<button name='save-more'
								className={
									[
										'action-item-d-white',
										isPending ? 'button-submitting' : ''
									].join(' ')
								}
							>{language?.saveMore}</button>
						</div>
					</form>
				</div>
			</div >
		</div >
	)
}
