import { useMutation } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import { apiDeleteChapter, apiUpdateChapter } from '../api/chapter'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { Chapter } from '../models/chapter'
import { ComponentViewChapterLang } from '../models/lang'
import styles from '../styles/global/ViewModel.module.css'
import FormUtils from '../utils/FormUtils'
import Loading from './Loading'
import YesNoPopUp from './YesNoPopUp'

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
	const [showDeletePopUp, setShowDeletePopUp] = useState(false)
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
	const formUtils = new FormUtils(styles)
	const handleUpdateChapter = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(styles['form-data'])?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node)?.removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiUpdateChapter(formData, data.id)
	}
	const handleDeleteChapter = async () => {
		return apiDeleteChapter(data.id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateChapter,
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
		<>
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeleteChapter}
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
								onInput={(e) => { formUtils.handleOnInput(e) }}
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
											name='chapter_number'
											disabled={!permissions.has('subject_update')}
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
											disabled={!permissions.has('subject_update')}
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
									permissions.has('subject_update') ?
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
						</div>
					</>
				</div>
			</div>
		</>
	)
}
