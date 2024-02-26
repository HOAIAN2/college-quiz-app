import { useMutation } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiCreateQuestion } from '../api/question'
import useLanguage from '../hooks/useLanguage'
import { ComponentCreateQuestionLang } from '../models/lang'
import { SubjectDetail } from '../models/subject'
import styles from '../styles/CreateQuestion.module.css'
import CustomSelect from './CustomSelect'
import Loading from './Loading'

type CreateQuestionProps = {
	subjectDetail: SubjectDetail
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateQuestion({
	subjectDetail,
	onMutateSuccess,
	setShowPopUp
}: CreateQuestionProps) {
	const [hide, setHide] = useState(true)
	const language = useLanguage<ComponentCreateQuestionLang>('component.create_question')
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	const getParentElement = (element: HTMLInputElement) => {
		let parent = element.parentElement as HTMLElement
		while (!parent.classList.contains(styles['wrap-item'])) parent = parent.parentElement as HTMLElement
		return parent
	}
	const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
		const element = e.target as HTMLInputElement
		if (element) {
			element.classList.remove('error')
			getParentElement(element).removeAttribute('data-error')
		}
	}
	const handleCreateQuestion = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(styles['form-data'])?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			getParentElement(node).removeAttribute('data-error')
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
		onError: (error: object) => {
			if (typeof error === 'object') {
				for (const key in error) {
					const element = document.querySelector<HTMLInputElement>(`input[data-selector='${key}'],[name='${key}']`)
					if (element) {
						element.classList.add('error')
						getParentElement(element).setAttribute('data-error', error[key as keyof typeof error][0] as string)
					}
				}
			}
		},
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
				styles['create-model-container'],
				hide ? styles['hide'] : ''
			].join(' ')
		}>
			{
				isPending ? <Loading /> : null
			}
			<div className={
				[
					styles['create-model-form'],
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
					<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
						mutate(e)
					}}
						onInput={handleOnInput}
						className={styles['form-data']}>
						<div className={
							[
								styles['group-inputs']
							].join(' ')
						}>
							<div className={styles['wrap-item']}>
								<label htmlFor="">{language?.chapter}</label>
								<CustomSelect
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
											styles['custom-select']
										].join(' ')
									}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor="">{language?.level}</label>
								<CustomSelect
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
									onChange={(option) => {
										console.log(option)
									}}
									className={
										[
											styles['custom-select']
										].join(' ')
									}
								/>
							</div>
							<div className={
								[
									styles['wrap-item'],
									styles['textarea']
								].join(' ')
							}>
								<label className={styles['required']} htmlFor='password'>{language?.content}</label>
								<textarea name='content' id='content'
									className={
										[
											'input-d',
											styles['input-item'],
										].join(' ')
									}
									cols={30} rows={50}>
								</textarea>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
