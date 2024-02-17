import { useMutation } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiUpdateChapter } from '../api/chapter'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { Chapter } from '../models/chapter'
import { ComponentViewChapterLang } from '../models/lang'
import styles from '../styles/global/ViewModel.module.css'
import Loading from './Loading'

type ViewChapterProps = {
	data: Chapter
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ViewChapter({
	data,
	onMutateSuccess,
	setShowPopUp
}: ViewChapterProps) {
	const [hide, setHide] = useState(true)
	const language = useLanguage<ComponentViewChapterLang>('component.view_chapter')
	const { permissions } = useAppContext()
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
	const handleUpdateChapter = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(styles['form-data'])?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			getParentElement(node).removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiUpdateChapter(formData, data.id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateChapter,
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
	}, [])
	return (
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
					<h2 className={styles['title']}>{data.name}</h2>
					<div className={styles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<>
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
									<label className={styles['required']} htmlFor='chapter_number'>{language?.chapterNumber}</label>
									<input
										id='chapter_number'
										disabled
										defaultValue={data.chapterNumber}
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
										disabled={!permissions.has('faculty_update')}
										defaultValue={data.name}
										name='name'
										className={
											[
												'input-d',
												styles['input-item']
											].join(' ')
										} type='text' />
								</div>
							</div>
							{
								permissions.has('faculty_update') ?
									<div className={styles['action-items']}>
										<button name='save'
											className={
												[
													'action-item-d',
													// isPending ? 'button-submitting' : ''
												].join(' ')
											}
										>{language?.save}</button>
									</div>
									: null
							}
						</form>
					</div>
				</>
			</div>
		</div>
	)
}
